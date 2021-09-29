const url = require('url')
const { web3, account } = require('../utils/getWeb3')
const { getOceanBalance, getEthBalance } = require('../utils/getBalance')
const { getTokenInstance } = require('../utils/getTokenInstance')
const { isAllowed } = require('../utils/getIsAllowed')
const { insert, find } = require('../db')
const { homeController } = require('./homeController')

const sendController = async (res, req) => {
  try {
    let ipAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress
    console.log(`ip address - `, ipAddress)
    const url_parts = url.parse(req.url, true)
    const { query } = url_parts

    const from = account
    const to = query.address
    const value = web3.utils.toWei(process.env.TOKEN_AMOUNT, 'ether')

    // Check if its valid ETH address
    if (web3.utils.isAddress(to)) {
      const oceanBalance = await getOceanBalance(to)
      const EthBalance = await getEthBalance(to)
      if (
        process.env.TOKEN_CONTRACT_ADDRESS ===
          '0x0000000000000000000000000000000000000000' &&
        EthBalance > process.env.ETH_BALANCE_LIMIT
      ) {
        // handle Ether Balance is more than limit
        homeController(
          res,
          `You already have ${process.env.BASE_TOKEN_NAME} in your wallet.\nPlease come back when you require ${process.env.BASE_TOKEN_NAME}`,
          false
        )
      } else if (
        process.env.TOKEN_CONTRACT_ADDRESS !==
          '0x0000000000000000000000000000000000000000' &&
        oceanBalance > process.env.OCEAN_BALANCE_LIMIT
      ) {
        // handle Ocean Balance is more than limit
        homeController(
          res,
          `You already have Ocean in your wallet.\nPlease come back when you require Ocean`,
          false
        )
      } else {
        //check if this user is in cool down period
        await find(query.address, async (records) => {
          console.log(records[0])
          if (records[0] && !isAllowed(records[0].lastUpdatedOn)) {
            homeController(
              res,
              'You have to wait 24 hours between faucet requests',
              false
            )
          } else {
            //insert ip address into db
            await insert(
              { ip: ipAddress, wallet: to, lastUpdatedOn: Date.now() },
              (result) => console.log(result)
            )

            if (
              process.env.TOKEN_CONTRACT_ADDRESS !=
              '0x0000000000000000000000000000000000000000'
            ) {
              //create token instance from abi and contract address
              const tokenInst = getTokenInstance()
              tokenInst.methods
                .transfer(to, value)
                .send({ from }, async function (error, txHash) {
                  if (!error) {
                    console.log('txHash - ', txHash)
                    homeController(
                      res,
                      `Great!! test OCEANs are on the way !!`,
                      true,
                      txHash
                    )
                  } else {
                    console.error(error)
                  }
                })
            } else {
              // sending ETH
              web3.eth.sendTransaction(
                { from, to, value },
                async function (error, txHash) {
                  if (!error) {
                    console.log('txHash - ', txHash)
                    homeController(
                      res,
                      `Great!! Network funds are on the way !!`,
                      true,
                      txHash
                    )
                  } else {
                    console.error(error)
                  }
                }
              )
            }
          }
        })
      }
    } else {
      //handle incorrect address response
      homeController(res, `Please enter valid Ethereum Wallet Address`, false)
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = { sendController }

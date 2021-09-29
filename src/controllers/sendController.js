const url = require('url')
const { web3, account } = require('../utils/getWeb3')
const { getTokenInstance } = require('../utils/getTokenInstance')
const { isAllowed } = require('../utils/isAllowed')
const { isCoolingDown } = require('../utils/isCoolingDown')
const { insert, find } = require('../db')
const { renderHome } = require('./renderHome')

const sendController = async (res, req) => {
  try {
    const { message, status } = await isAllowed(req)
    if (status === false) {
      renderHome(res, message, status)
    } else {
      const ipAddress =
        req.headers['x-forwarded-for'] || req.connection.remoteAddress
      console.log(`ip address - `, ipAddress)
      const url_parts = url.parse(req.url, true)
      const { query } = url_parts

      const from = account
      const to = query.address
      const value = web3.utils.toWei(process.env.TOKEN_AMOUNT, 'ether')

      //check if this user is in cool down period
      await find(query.address, async (records) => {
        console.log(records[0])
        if (records[0] && !isCoolingDown(records[0].lastUpdatedOn)) {
          renderHome(
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
                  renderHome(
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
                  renderHome(
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
  } catch (err) {
    console.error(err)
  }
}

module.exports = { sendController }

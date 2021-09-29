const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const url = require('url')
const { web3, account } = require('./utils/getWeb3')
const path = require('path')
const { connection, insert, find } = require('./db')
const { isAllowed } = require('./utils/getIsAllowed')
const { getTokenInstance } = require('./utils/getTokenInstance')
const { homeController } = require('./controllers/homeController')
const {
  getOceanBalance,
  getEthBalance,
  getFaucetBalance
} = require('./utils/getBalance')

const app = express()
const tokenName = process.env.TOKEN_NAME ? process.env.TOKEN_NAME : 'OCEAN'
const tokenAmount = process.env.TOKEN_AMOUNT

app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  homeController(res)
})

app.get('/send', async (req, res) => {
  try {
    let balance = await getFaucetBalance(account)
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
      console.log('oceanBalance', oceanBalance)
      console.log('EthBalance', EthBalance)
      if (
        process.env.TOKEN_CONTRACT_ADDRESS ===
          '0x0000000000000000000000000000000000000000' &&
        EthBalance > process.env.ETH_BALANCE_LIMIT
      ) {
        // handle Ether Balance is more than limit
        res.render('index.ejs', {
          message: `You already have ${process.env.BASE_TOKEN_NAME} in your wallet.\nPlease come back when you require ${process.env.BASE_TOKEN_NAME}`,
          status: false,
          balance,
          tokenAmount,
          tokenName,
          account
        })
      } else if (
        process.env.TOKEN_CONTRACT_ADDRESS !==
          '0x0000000000000000000000000000000000000000' &&
        oceanBalance > process.env.OCEAN_BALANCE_LIMIT
      ) {
        // handle Ocean Balance is more than limit
        res.render('index.ejs', {
          message: `You already have Ocean in your wallet.\nPlease come back when you require Ocean`,
          status: false,
          balance,
          tokenAmount,
          tokenName,
          account
        })
      } else {
        //check if this user is in cool down period
        await find(query.address, async (records) => {
          console.log(records[0])
          if (records[0] && !isAllowed(records[0].lastUpdatedOn)) {
            res.render('index.ejs', {
              message: 'You have to wait 24 hours between faucet requests',
              status: false,
              balance,
              tokenAmount,
              tokenName,
              account
            })
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
                    res.render('index.ejs', {
                      message: `Great!! test OCEANs are on the way !!`,
                      txHash,
                      status: true,
                      balance,
                      tokenAmount,
                      tokenName,
                      account
                    })
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
                    res.render('index.ejs', {
                      message: `Great!! Network funds are on the way !!`,
                      txHash,
                      status: true,
                      balance,
                      tokenAmount,
                      tokenName,
                      account
                    })
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
      res.render('index.ejs', {
        message: `Please enter valid Ethereum Wallet Address`,
        status: false,
        balance,
        tokenAmount,
        tokenName,
        account
      })
    }
  } catch (err) {
    console.error(err)
  }
})

const port = process.env.PORT || 4000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/public'))
app.use(express.static(__dirname + '/public'))

app.listen(port, async () => {
  await connection()
  console.log('Listening on port - ', port)
})

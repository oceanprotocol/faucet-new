const express = require('express')
const bodyParser = require('body-parser')
const url = require('url')
const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const abi = require('./abi/token')
const { connection, insert, find } = require('./db')
var client = null
require('dotenv').config()

const infura_apikey = process.env.INFURA_NODE_ID

const provider = new HDWalletProvider(
  process.env.SEED_PHRASE,
  'https://rinkeby.infura.io/v3/' + infura_apikey
)
const web3 = new Web3(provider)

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

const template = (err, message, transactionHash) => `
  <html>
    <head>
      <title>Rinkeby OCEAN Faucet</title>
    </head>
    <body>
      <h1>Rinkeby test OCEAN Faucet</h1>
      <h4>Give me your address and I'll give you .001 ether!</h4>
      <form action="/send">
        <label>My Address:</label>
        <input name="address" />
        <button>Submit</button>
        <span style="display: none" class="loader loader--style1" title="0">
          <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
           width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
          <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
            s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
            c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
          <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
            C22.32,8.481,24.301,9.057,26.013,10.047z">
            <animateTransform attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="0.5s"
              repeatCount="indefinite"/>
            </path>
          </svg>
        </span>
      </form>
      <h3 style="color: red">${err || ''}</h3>
      <h3>${message || ''}</h3>
      <p>
        ${transactionHash
    ? `If you're curious, here is your transaction id: ${transactionHash}`
    : ''}
      </p>
    </body>
    <script>
      var button = document.querySelector('button')
      button.addEventListener('click', function() {
        button.style.display = 'none'
        document.querySelector('.loader').style.display = 'inline'
      })
    </script>
  </html>
`

app.get('/', (req, res) => {
  res.send(template())
})

app.get('/send', async (req, res) => {

  try {

    let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    console.log(`ip address - `, ipAddress)
    const url_parts = url.parse(req.url, true)
    const query = url_parts.query

    const from = process.env.FROM
    const to = query.address
    const value = web3.utils.toWei(process.env.TOKEN_AMOUNT, 'ether')

    //check if this user is in cool down period
    await find({ $or: [{ "ip": ipAddress }, { "wallet": query.address }] }, shouldTransfer => {
      if (shouldTransfer) {
        res.send(
          template('', "You have to wait 24 hours between faucet requests", undefined)
        )
      }
    })

    //insert ip address into db
    await insert({ ip: ipAddress, wallet: to, lastUpdatedOn: Date.now() }, (result) => console.log(result))

    //create token instance from abi and contract address
    const tokenInstance = new web3.eth.Contract(abi, process.env.TOKEN_CONTRACT_ADDRESS)

    tokenInstance.methods.transfer(to, value).send({ from }, function (error, txHash) {
      if (!error) {
        console.log(txHash)
        res.send(
          template('', 'Great, test OCEANs are on the way!', txHash)
        )
      } else {
        console.error(err)
      }
    })

  } catch (err) {
    console.error(err)
  }
})

const port = process.env.PORT || 4000
app.listen(port, async () => {
  client = await connection()
  console.log('Listening on port - ', port)
})
const { account } = require('../utils/getWeb3')
const { getFaucetBalance } = require('../utils/getBalance')
const tokenName = process.env.TOKEN_NAME ? process.env.TOKEN_NAME : 'OCEAN'
const tokenAmount = process.env.TOKEN_AMOUNT

const homeController = async (res) => {
  let balance = await getFaucetBalance(account)

  res.render('index.ejs', {
    message: null,
    status: false,
    balance,
    tokenAmount,
    tokenName,
    account
  })
}

module.exports = { homeController }

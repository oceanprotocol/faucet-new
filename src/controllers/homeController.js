const { account } = require('../utils/getWeb3')
const { getFaucetBalance, getFaucetGasBalance } = require('../utils/getBalance')
const tokenName = process.env.TOKEN_NAME ? process.env.TOKEN_NAME : 'OCEAN'
const baseTokenName = process.env.BASE_TOKEN_NAME
  ? process.env.BASE_TOKEN_NAME
  : 'ETH'
const tokenAmount = process.env.TOKEN_AMOUNT

const homeController = async (res) => {
  const balance = await getFaucetBalance(account)
  const gasBalance = await getFaucetGasBalance(account)

  res.render('index.ejs', {
    message: null,
    status: false,
    balance,
    tokenAmount,
    tokenName,
    account,
    gasBalance,
    baseTokenName
  })
}

module.exports = { homeController }

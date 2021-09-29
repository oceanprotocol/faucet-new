const { account } = require('../utils/getWeb3')
const { getFaucetBalance, getFaucetGasBalance } = require('../utils/getBalance')
const tokenName = process.env.TOKEN_NAME ? process.env.TOKEN_NAME : 'OCEAN'
const baseTokenName = process.env.BASE_TOKEN_NAME
  ? process.env.BASE_TOKEN_NAME
  : 'ETH'
const tokenAmount = process.env.TOKEN_AMOUNT

const renderHome = async (
  res,
  message = null,
  status = false,
  txHash = null
) => {
  const balance = await getFaucetBalance(account)
  const gasBalance = await getFaucetGasBalance(account)

  res.render('index.ejs', {
    message: message,
    status: status,
    balance,
    tokenAmount,
    tokenName,
    account,
    gasBalance,
    baseTokenName,
    txHash
  })
}

module.exports = { renderHome }

const { web3 } = require('../utils/getWeb3')
const { getOceanBalance, getEthBalance } = require('../utils/getBalance')

const isAllowed = async (to) => {
  let message = null
  let status = false
  // Check if its valid ETH address
  if (!web3.utils.isAddress(to)) {
    message = `Please enter valid Ethereum Wallet Address`
    return { message, status }
  }
  const oceanBalance = await getOceanBalance(to)
  const EthBalance = await getEthBalance(to)

  if (
    // Check Ether balance is below limit
    process.env.TOKEN_CONTRACT_ADDRESS ===
      '0x0000000000000000000000000000000000000000' &&
    EthBalance > process.env.ETH_BALANCE_LIMIT
  ) {
    message = `You already have ${process.env.BASE_TOKEN_NAME} in your wallet.\nPlease come back when you require ${process.env.BASE_TOKEN_NAME}`
  } else if (
    // Check Ether balance is below limit
    process.env.TOKEN_CONTRACT_ADDRESS !==
      '0x0000000000000000000000000000000000000000' &&
    oceanBalance > process.env.OCEAN_BALANCE_LIMIT
  ) {
    message = `You already have Ocean in your wallet.\nPlease come back when you require Ocean`
  } else {
    status = true
  }
  return { message, status }
}

module.exports = { isAllowed }

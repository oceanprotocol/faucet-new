const { web3 } = require('./getWeb3')
const abi = require('../abi/token')

const getTokenInstance = () => {
  try {
    //create token instance from abi and contract address
    const tokenInstance = new web3.eth.Contract(
      abi,
      process.env.TOKEN_CONTRACT_ADDRESS
    )
    // console.log('tokenInstance', tokenInstance)
    return tokenInstance
  } catch (error) {
    console.log('Error', error)
  }
}

module.exports = { getTokenInstance }

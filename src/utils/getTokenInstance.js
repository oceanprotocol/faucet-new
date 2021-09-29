const HDWalletProvider = require('@truffle/hdwallet-provider')
const abi = require('../abi/token')
const Web3 = require('web3')
const rpc = process.env.RPC
const provider = new HDWalletProvider(process.env.SEED_PHRASE, rpc)
const web3 = new Web3(provider)

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

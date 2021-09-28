const HDWalletProvider = require('@truffle/hdwallet-provider')
const abi = require('../abi/token')
const Web3 = require('web3')
require('dotenv').config()

const rpc = process.env.RPC

const provider = new HDWalletProvider(process.env.SEED_PHRASE, rpc)
const web3 = new Web3(provider)
function getTokenInstance() {
  //create token instance from abi and contract address
  const tokenInstance = new web3.eth.Contract(
    abi,
    process.env.TOKEN_CONTRACT_ADDRESS
  )
  return tokenInstance
}

const getOceanBallance = async () => {
  try {
    const contract = await getTokenInstance(web3)
    const account = await web3.eth.getAccounts()
    const ballanceOcean = await contract.methods
      .balanceOf(String(account))
      .call()
    return ballanceOcean
  } catch (error) {
    console.log(error)
  }
}

const getEthBallance = async () => {
  try {
    const account = await web3.eth.getAccounts()
    const ballanceEth = await web3.eth.getBalance(String(account))

    return ballanceEth
  } catch (error) {
    console.log(error)
  }
}
module.exports = { getOceanBallance, getEthBallance }

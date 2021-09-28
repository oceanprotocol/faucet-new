const HDWalletProvider = require('@truffle/hdwallet-provider')
const Web3 = require('web3')
require('dotenv').config()

const rpc = process.env.RPC

const provider = new HDWalletProvider(process.env.SEED_PHRASE, rpc)
const web3 = new Web3(provider)

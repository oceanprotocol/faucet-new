const abi = require('../abi/token')

export default async function getContract(web3) {
  let instance = null
  // Get the contract instance.
  const networkId = await web3.eth.net.getId()
  const deployedNetwork = abi.networks[networkId]

  if (deployedNetwork) {
    instance = new web3.eth.Contract(
      abi,
      deployedNetwork && deployedNetwork.address
    )
  } else {
    window.alert(
      'Sorry, the WrappedGX smart contract is not deployed to the current network.'
    )
  }

  return instance
}

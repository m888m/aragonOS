const getContract = name => artifacts.require(name)

module.exports = function (deployer, network, accounts, arts = null) {
  return deployer.then(async () => {
    if (arts != null) artifacts = arts // allow running outside

    const DAOFactory = artifacts.require('DAOFactory')
    const EVMScriptRegistryFactory = artifacts.require('EVMScriptRegistryFactory')

    const kernelBase = await getContract('Kernel').new(true) // immediately petrify
    const aclBase = await getContract('ACL').new()

    const regFact = await EVMScriptRegistryFactory.new()
    const daoFact = await DAOFactory.new(kernelBase.address, aclBase.address, regFact.address)

    if (!arts) { // Running standalone in aOS repo
      const receipt = await daoFact.newDAO(accounts[0])
      daoAddr = receipt.logs.filter(l => l.event == 'DeployDAO')[0].args.dao
      console.log('deployed DAO at', daoAddr)
    }

    return { daoFact }
  })
}

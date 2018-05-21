const HDWalletProvider = require('truffle-hdwallet-provider')
const PrivateKeyProvider = require('truffle-privatekey-provider')

const mnemonic = 'stumble story behind hurt patient ball whisper art swift tongue ice alien';

let ropstenProvider, kovanProvider, rinkebyProvider, mainnetProvider = {}

if (process.env.LIVE_NETWORKS) {
  ropstenProvider = new HDWalletProvider(mnemonic, 'https://ropsten.infura.io/')
  kovanProvider = new HDWalletProvider(mnemonic, 'https://kovan.infura.io')

  try {
    const { rpc, key } = require(require('homedir')()+'/.rinkebykey.json')
    rinkebyProvider = new PrivateKeyProvider(key, rpc)
    mainnetProvider = new PrivateKeyProvider(key, 'https://mainnet.infura.io')
  } catch (e) {
    rinkebyProvider = new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io')
  }
}

const mochaGasSettings = {
  reporter: 'eth-gas-reporter',
  reporterOptions : {
    currency: 'USD',
    gasPrice: 3
  }
}

const mocha = process.env.GAS_REPORTER ? mochaGasSettings : {}

module.exports = {
  networks: {
    rpc: {
      network_id: 15,
      host: 'localhost',
      port: 8545,
      gas: 6.9e6,
    },
    devnet: {
      network_id: 15,
      host: 'localhost',
      port: 8535,
      gas: 6.9e6,
    },
    mainnet: {
      network_id: 1,
      provider: mainnetProvider,
      gas: 7.3e6, // Lower than network limit and higher than required gas
      gasPrice: 19000000000, // 16 gwei -> May 21st 2018, 2 * safe low
    },
    ropsten: {
      network_id: 3,
      provider: ropstenProvider,
      gas: 4.712e6,
    },
    kovan: {
      network_id: 42,
      provider: kovanProvider,
      gas: 6.9e6,
    },
    rinkeby: {
      network_id: 4,
      provider: rinkebyProvider,
      gas: 6.9e6,
      gasPrice: 15000000001
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,
      gas: 0xffffffffff,
      gasPrice: 0x01
    },
  },
  build: {},
  mocha,
}

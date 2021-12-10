//const { alchemyApiKey, mnemonic } = require('./secrets.json');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1", //https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161 // "127.0.0.1"
      port: 7545, //7545 
      network_id: "*" // Match any network id
    }
    ,
    develop: {
      port: 8545
    },

    // ropsten: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`),
    //   network_id: 3,       // Ropsten's id
    //   gas: 5500000,        // Ropsten has a lower block limit than mainnet
    //   confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    //  },
     
//    },
//  };
  }
};

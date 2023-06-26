require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/ihPUduK-Fp15GsGxUTX92YyglOKJXiyp',
      accounts: ['1f1aec904899569d60605bfdb13428c689bdce679f31a72ea4c8a13ea5d31cf7'],
    },
  },
};
//https://eth-sepolia.g.alchemy.com/v2/ihPUduK-Fp15GsGxUTX92YyglOKJXiyp
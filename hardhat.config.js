require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
// require("@nomicfoundation/hardhat-verify");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.23",
  networks: {
    hardhat: {
      // loggingEnabled: true,
    },
    SEPOLIA: {
      url: process.env.SEPOLIA_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    GOERLI: {
      url: process.env.GOERLI_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  }
};


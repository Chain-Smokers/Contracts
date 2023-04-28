require("dotenv").config({ path: __dirname + "/.env" });
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-network-helpers");
require("solidity-coverage");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: process.env.HOST_LOCAL_ADDRESS,
      accounts: [process.env.ETH_LOCAL_ACCOUNT],
    },
    cloud: {
      url: process.env.HOST_CLOUD_ADDRESS,
      accounts: [process.env.ETH_CLOUD_ACCOUNT],
    },
  },
};

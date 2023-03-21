import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
dotenv.config();

import "./tasks";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.12",
      },
    ],
    overrides: {
      "contracts/ERC20.sol": {
        version: "0.8.18",
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    bnbtest: {
      url: process.env.BNBTest_URL,
      accounts: {
        mnemonic: process.env.BNBTest_MNEMONIC,
        count: 10,
      },
    },
    bnb: {
      url: process.env.BNB_URL,
      accounts:
        process.env.BNB_PRIVATE_KEY !== undefined
          ? [process.env.BNB_PRIVATE_KEY]
          : [],
    },
  },

  mocha: {
    timeout: 200000,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;

import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@semaphore-protocol/hardhat";
import "@typechain/hardhat";
import { config as dotenvConfig } from "dotenv";
import "hardhat-gas-reporter";
import { HardhatUserConfig } from "hardhat/config";

import "solidity-coverage";
import { config } from "./package.json";
import "./tasks/deploy";

dotenvConfig();

const accounts = [`0x${process.env.ETHEREUM_PRIVATE_KEY}`];

const hardhatConfig: HardhatUserConfig = {
  solidity: config.solidity,
  paths: {
    sources: config.paths.contracts,
    tests: config.paths.tests,
    cache: config.paths.cache,
    artifacts: config.paths.build.contracts,
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      chainId: 100,
      accounts,
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS === "true",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  typechain: {
    outDir: config.paths.build.typechain,
    target: "ethers-v5",
  },
};

export default hardhatConfig;

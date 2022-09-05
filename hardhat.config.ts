import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/config';

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: '0.8.9',
  paths: {
    artifacts: './frontend/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337, // We set 1337 to make interacting with MetaMask simpler
    },
  },
  typechain: {
    outDir: './frontend/types/typechain',
  },
};

export default config;

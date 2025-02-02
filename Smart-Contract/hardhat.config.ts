import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import "@nomicfoundation/hardhat-verify"
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.ETHERSCAN_API);


const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    liskSepolia: {
      url: "https://rpc.sepolia-api.lisk.com",
      chainId: 4202, // Lisk Sepolia RPC
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API, // Blockscout API key
    customChains: [
      {
        network: "lisk-sepolia",
        chainId: 4202,
        urls: {
          apiURL: "https://sepolia-blockscout.lisk.com/api",
          browserURL: "https://sepolia-blockscout.lisk.com",
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://server-verify.hashscan.io",
    browserUrl: "https://repository-verify.hashscan.io",
  },
};

export default config;



// const config: HardhatUserConfig = {
//   solidity: "0.8.26",
//   networks: {
//     // for testnet
//     'lisk-sepolia': {
//       url: 'https://rpc.api.lisk.com',
//       accounts: [process.env.PRIVATE_KEY as string]
//     },
//   },
//   etherscan: {
//     // Use "123" as a placeholder, because Blockscout doesn't need a real API key, and Hardhat will complain if this property isn't set.
//     apiKey: {
//       "lisk-sepolia": "123"
//     },
//     customChains: [
//       {
//           network: "lisk-sepolia",
//           chainId: 4202,
//           urls: {
//               apiURL: "https://sepolia-blockscout.lisk.com/api",
//               browserURL: "https://sepolia-blockscout.lisk.com"
//           }
//       }
//     ]
//   },
//   sourcify: {
//     enabled: false
//   },
// };


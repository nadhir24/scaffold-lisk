// Create a helper to convert the chain
import { defineChain } from "thirdweb";

export const liskSepoliaChain = defineChain({
  id: 4202,
  name: "Lisk Sepolia Testnet",
  rpc: "https://rpc.sepolia-api.lisk.com",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://sepolia-blockscout.lisk.com",
    },
  ],
  testnet: true,
});

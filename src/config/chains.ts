import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { defineChain } from "viem";

export const kaiaTestnet = defineChain({
  id: 1001,
  name: "Kaia Testnet",
  network: "kaia-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "KAIA",
    symbol: "KAIA",
  },
  rpcUrls: {
    default: {
      http: ["https://public-en-kairos.node.kaia.io"],
    },
    public: {
      http: ["https://public-en-kairos.node.kaia.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Kaia Explorer",
      url: "https://kairos.kaiascope.com",
    },
  },
});

export const kaiaMainnet = defineChain({
  id: 8217,
  name: "Kaia Mainnet",
  network: "kaia",
  nativeCurrency: {
    decimals: 18,
    name: "KAIA",
    symbol: "KAIA",
  },
  rpcUrls: {
    default: {
      http: ["https://public-en-node.kaia.io"],
    },
    public: {
      http: ["https://public-en-node.kaia.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Kaia Explorer",
      url: "https://kaiascope.com",
    },
  },
});

export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

export const wagmiAdapter = new WagmiAdapter({
  networks: [kaiaTestnet, kaiaMainnet],
  projectId,
  ssr: false, // Disable server-side rendering for better network handling
});

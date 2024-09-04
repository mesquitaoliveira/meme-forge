import { createConfig, http, fallback } from "wagmi";
import {  getDefaultConfig } from "connectkit";
import { sepolia, baseSepolia } from "wagmi/chains";

const walletConnectID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
export const config = createConfig(
  getDefaultConfig({
    appName: "eth-r",
    chains: [baseSepolia, sepolia],
    transports: {
      [baseSepolia.id]: http()
      // [sepolia.id]:http()
    },
    walletConnectProjectId: walletConnectID
  })
);
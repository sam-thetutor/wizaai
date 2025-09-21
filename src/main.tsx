import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import App from "./App.tsx";
import "./index.css";
import { WagmiProvider } from "wagmi";
import { kaiaTestnet, kaiaMainnet, wagmiAdapter, projectId } from "./config/chains";
import { AppKitNetwork } from "@reown/appkit/networks";

const queryClient = new QueryClient();
// Kaia networks only
const networks: AppKitNetwork[] = [kaiaTestnet, kaiaMainnet];

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  defaultNetwork: kaiaTestnet, // Force Kaia Testnet as default
  metadata: {
    name: "Wiza - Web3 Education Platform",
    description: "Decentralized education platform on Kaia blockchain",
    url: "https://wiza-kaia.netlify.app",
    icons: ["https://wiza-kaia.netlify.app/icon.png"],
  },
  features: {
    analytics: true,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  networks: networks as any,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  </StrictMode>
);

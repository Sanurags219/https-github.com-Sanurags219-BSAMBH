
import { createConfig, http, injected } from "wagmi";
// Fix: Import base from viem/chains as it may be missing from wagmi/chains in some environments
import { base } from "viem/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

// Standard Wagmi 2.x config with safe connector initialization
export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    farcasterMiniApp(),
    injected(),
  ],
});

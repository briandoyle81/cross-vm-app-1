'use client'

import { createFclConnector } from '@onflow/fcl-rainbowkit-adapter';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  flowTestnet,
} from 'wagmi/chains';
import * as fcl from '@onflow/fcl';
import { createConfig, http } from 'wagmi';

fcl.config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "walletconnect.projectId": "9b70cfa398b2355a5eb9b1cf99f4a981",
})

const flowWalletConnector = createFclConnector({
  user: fcl.currentUser,
  config: fcl.config,
  service: {
        "f_type": "Service",
        "f_vsn": "1.0.0",
        "type": "authn",
        "uid": "Flow Wallet",
        "endpoint": "chrome-extension://hpclkefagolihohboafpheddmmgdffjm/popup.html",
        "method": "EXT/RPC",
        "id": "hpclkefagolihohboafpheddmmgdffjm",
        "identity": {
            "address": "0x33f75ff0b830dcec"
        },
        "provider": {
            "name": "Flow Wallet",
            "address": "0x33f75ff0b830dcec",
            "description": "A wallet created for everyone",
            "icon": "https://lilico.app/frw-logo.png",
            "color": "#41CC5D",
            "website": "https://core.flow.com",
            "requires_install": true,
            "is_installed": true,
            "install_link": "https://chromewebstore.google.com/detail/flow-wallet/hpclkefagolihohboafpheddmmgdffjm",
            "rdns": "com.flowfoundation.wallet"
        }
    } as any,
})

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    "wallets": [
      flowWalletConnector as any,
    ],
  }
], {
  appName: 'RainbowKit demo',
  projectId: '9b70cfa398b2355a5eb9b1cf99f4a981',
});

export const config = createConfig({
  chains: [
    flowTestnet
  ],
  connectors,
  ssr: true,
  transports: {
    [flowTestnet.id]: http(),
  }
});


const options = {
  user: fcl.currentUser,
  config: fcl.config,
  service: {
    "f_type": "Service",
    "f_vsn": "1.0.0",
    "type": "authn",
    "method": "HTTP/POST",
    "uid": "blocto#authn",
    "endpoint": "https://wallet-v2-dev.blocto.app/api/flow/authn",
    "provider": {
      "name": "Blocto",
      "address": "0x55ad22f01ef568a1",
      "description": "Your entrance to the blockchain world.",
      "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTI5Ljg2OSA5MS44MzI0QzExNC45NTYgOTEuODMyNCAxMDAuNDAxIDk3LjU4MjQgODkuNTE5MSAxMDcuNzgyQzc3LjU4NDEgMTE4Ljk3MyA3MC4wMzEgMTM1LjUgNjUuNzAxNSAxNTEuMDQ2QzYyLjg2NTggMTYxLjIyIDYxLjQ0NTMgMTcxLjc3MiA2MS40NDUzIDE4Mi4zMjhDNjEuNDQ1MyAxODUuNTIgNjEuNTc2MyAxODguNjg2IDYxLjgyNzkgMTkxLjgxNUM2Mi4xMzcyIDE5NS42MjEgNjUuODQzIDE5OC4yNTcgNjkuNTMzIDE5Ny4yNjFDNzIuNzUxNCAxOTYuMzk2IDc2LjEzNzQgMTk1LjkzIDc5LjYyODMgMTk1LjkzQzg2Ljc5ODggMTk1LjkzIDkzLjUxODUgMTk3Ljg4IDk5LjI3ODkgMjAxLjI4N0M5OS40MjA1IDIwMS4zNzEgOTkuNTU2OCAyMDEuNDU1IDk5LjY5ODMgMjAxLjUzM0MxMDkuMDYgMjA3LjExNSAxMjAuMTA0IDIxMC4xODIgMTMxLjg4MiAyMDkuNzg5QzE2Mi42MDIgMjA4Ljc3MiAxODcuNjk5IDE4My43NzUgMTg4LjgzMSAxNTMuMDU5QzE5MC4wNjggMTE5LjQ1NSAxNjMuMiA5MS44MjcxIDEyOS44NzQgOTEuODI3MUwxMjkuODY5IDkxLjgzMjRaTTEyOS44NjkgMTc3Ljc4OUMxMTQuOTc3IDE3Ny43ODkgMTAyLjkwNiAxNjUuNzE4IDEwMi45MDYgMTUwLjgzMUMxMDIuOTA2IDEzNS45NDUgMTE0Ljk3NyAxMjMuODY5IDEyOS44NjkgMTIzLjg2OUMxNDQuNzYgMTIzLjg2OSAxNTYuODMxIDEzNS45NCAxNTYuODMxIDE1MC44MzFDMTU2LjgzMSAxNjUuNzIzIDE0NC43NiAxNzcuNzg5IDEyOS44NjkgMTc3Ljc4OVoiIGZpbGw9IiMxNEFBRkYiLz4KPHBhdGggZD0iTTEwNS42MTEgNzMuMjU2OUMxMDUuNjExIDgxLjAzMDIgMTAxLjUzOCA4OC4yNDI2IDk0Ljg0OTkgOTIuMjA1MkM5MC42NTE0IDk0LjY5NDkgODYuNzE1IDk3LjYzNTUgODMuMTUwOCAxMDAuOTg1Qzc1LjI0MTIgMTA4LjM5NiA2OS4zMzkyIDExNy40OTEgNjQuOTY3OCAxMjYuNTA2QzY0LjEwODEgMTI4LjI4MyA2MS40NDAyIDEyNy42NTQgNjEuNDQwMiAxMjUuNjc4VjczLjI1NjlDNjEuNDQwMiA2MS4wNTk4IDcxLjMzMSA1MS4xNjg5IDgzLjUyODIgNTEuMTY4OUM5NS43MjUzIDUxLjE2ODkgMTA1LjYxNiA2MS4wNTk4IDEwNS42MTYgNzMuMjU2OUgxMDUuNjExWiIgZmlsbD0iIzAwNzdGRiIvPgo8L3N2Zz4K",
      "color": "#0075FF",
      "website": "https://blocto.io"
    }
  } as any,
}

console.log(config);

(globalThis as any).cfg = config;
(globalThis as any).fcl = fcl;

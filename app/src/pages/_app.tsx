import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { SolanaWalletProvider } from '../contexts/solana-wallet-context';
import { AutoConnectProvider } from '../contexts/auto-connect-context';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AutoConnectProvider>
      <SolanaWalletProvider>
        <Component {...pageProps} />
      </SolanaWalletProvider>
    </AutoConnectProvider>
  )
}

export default MyApp

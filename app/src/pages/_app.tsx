import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import { SolanaWalletProvider } from '../contexts/solana-wallet-context';
import { AutoConnectProvider } from '../contexts/auto-connect-context';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AutoConnectProvider>
        <SolanaWalletProvider>
          <Component {...pageProps} />
        </SolanaWalletProvider>
      </AutoConnectProvider>
    </ChakraProvider>    
  )
}

export default MyApp

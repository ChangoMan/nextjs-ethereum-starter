import { ApolloProvider } from '@apollo/client'
import { ChainId, Config, DAppProvider } from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { useApollo } from '../lib/apolloClient'
import '../styles/globals.css'

const config: Config = {
  // readOnlyChainId: ChainId.Mainnet,
  // readOnlyUrls: {
  //   [ChainId.Mainnet]:
  //     'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
  // },
  // readOnlyChainId: ChainId.Localhost,
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Goerli,
    ChainId.Kovan,
    ChainId.Rinkeby,
    ChainId.Ropsten,
    ChainId.xDai,
    ChainId.Localhost,
    ChainId.Hardhat,
  ],
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <DAppProvider config={config}>
        <Component {...pageProps} />
      </DAppProvider>
    </ApolloProvider>
  )
}

export default MyApp

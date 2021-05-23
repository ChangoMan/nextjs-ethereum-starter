import { ApolloProvider } from '@apollo/client'
import { Web3ReactProvider } from '@web3-react/core'
import { providers } from 'ethers'
import type { AppProps } from 'next/app'
import React from 'react'
import { useApollo } from '../lib/apolloClient'
// import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'

function getLibrary(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <ChakraProvider>
      <ApolloProvider client={apolloClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Component {...pageProps} />
        </Web3ReactProvider>
      </ApolloProvider>
    </ChakraProvider>
  )
}

export default MyApp

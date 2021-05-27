import { Button, Container, Flex, Image, Link, Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import blockies from 'blockies-ts'
import React from 'react'
import Balance from '../Balance'
import Head, { MetaProps } from './Head'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

type LayoutProps = {
  children: React.ReactNode
  customMeta?: MetaProps
}

const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const { account, activateBrowserWallet, deactivate, error } = useEthers()

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Container maxW="container.xl">
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
              py: 8,
            }}
          >
            {account ? (
              <Flex sx={{ alignItems: 'center' }}>
                <Balance />
                <Image sx={{ ml: 4 }} src={blockieImageSrc} alt="blockie" />
                <Text sx={{ mx: 4 }}>
                  {account.replace(account.substring(6, 38), '...')}
                </Text>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    deactivate()
                  }}
                >
                  Disconnect
                </Button>
              </Flex>
            ) : (
              <Button
                colorScheme="teal"
                onClick={() => {
                  activateBrowserWallet()
                }}
              >
                Connect To MetaMask
              </Button>
            )}
          </Flex>
          {error && <Text>{error}</Text>}
        </Container>
      </header>
      <main>{children}</main>
      <footer>
        <Container sx={{ py: 8 }} maxW="container.xl">
          <Text>
            Built by{' '}
            <Link href="https://twitter.com/huntarosan">Hunter Chang</Link>
          </Text>
        </Container>
      </footer>
    </>
  )
}

export default Layout

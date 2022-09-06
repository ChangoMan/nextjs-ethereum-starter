import { Container, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'
import React from 'react'
import { Head, MetaProps } from './Head'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Container maxWidth="container.xl">
          <SimpleGrid
            columns={[1, 1, 1, 2]}
            alignItems="center"
            justifyContent="space-between"
            py="8"
          >
            <Flex py={[4, null, null, 0]}>
              <NextLink href="/" passHref>
                <Link px="4" py="1">
                  Home
                </Link>
              </NextLink>
              <NextLink href="/authenticated" passHref>
                <Link px="4" py="1">
                  Authenticated
                </Link>
              </NextLink>
              <NextLink href="/nft" passHref>
                <Link px="4" py="1">
                  Mint NFT
                </Link>
              </NextLink>
              <NextLink href="/token-gated" passHref>
                <Link px="4" py="1">
                  Token Gated
                </Link>
              </NextLink>
            </Flex>
            <Flex
              order={[-1, null, null, 2]}
              alignItems={'center'}
              justifyContent={['flex-start', null, null, 'flex-end']}
            >
              <ConnectButton />
            </Flex>
          </SimpleGrid>
        </Container>
      </header>
      <main>
        <Container maxWidth="container.xl">{children}</Container>
      </main>
      <footer>
        <Container mt="8" py="8" maxWidth="container.xl">
          <Text>
            Built by{' '}
            <Link href="https://twitter.com/hunterhchang">Hunter Chang</Link>
          </Text>
        </Container>
      </footer>
    </>
  )
}

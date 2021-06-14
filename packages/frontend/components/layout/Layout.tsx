import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useEthers, useNotifications } from '@usedapp/core'
import blockies from 'blockies-ts'
import NextLink from 'next/link'
import React from 'react'
import { walletconnect } from '../../lib/connectors'
import Balance from '../Balance'
import Head, { MetaProps } from './Head'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

/**
 * Constants & Helpers
 */

// Title text for the various transaction notifications.
const TRANSACTION_TITLES = {
  transactionStarted: 'Local Transaction Started',
  transactionSucceed: 'Local Transaction Completed',
}

// Takes a long hash string and truncates it.
function truncateHash(hash: string, length = 38): string {
  return hash.replace(hash.substring(6, length), '...')
}

/**
 * Prop Types
 */
interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

/**
 * Component
 */
const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const { account, activate, activateBrowserWallet, deactivate } = useEthers()
  const { notifications } = useNotifications()

  const { isOpen, onOpen, onClose } = useDisclosure()

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Container sx={{ maxWidth: 'container.xl' }}>
          <SimpleGrid
            columns={[1, 1, 1, 2]}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 8,
            }}
          >
            <Flex sx={{ py: [4, null, null, 0] }}>
              <NextLink href="/" passHref>
                <Link sx={{ px: 4, py: 1 }}>Home</Link>
              </NextLink>
              <NextLink href="/graph-example" passHref>
                <Link sx={{ px: 4, py: 1 }}>Graph Example</Link>
              </NextLink>
              <NextLink href="/signature-example" passHref>
                <Link sx={{ px: 4, py: 1 }}>Signature Example</Link>
              </NextLink>
            </Flex>
            {account ? (
              <Flex
                sx={{
                  order: [-1, null, null, 2],
                  alignItems: 'center',
                  justifyContent: ['flex-start', null, null, 'flex-end'],
                }}
              >
                <Balance />
                <Image sx={{ ml: 4 }} src={blockieImageSrc} alt="blockie" />
                <Text sx={{ mx: 4 }}>{truncateHash(account)}</Text>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  onClick={() => {
                    deactivate()
                  }}
                >
                  Disconnect
                </Button>
              </Flex>
            ) : (
              <Box
                sx={{
                  order: [-1, null, null, 2],
                  textAlign: ['left', null, null, 'right'],
                }}
              >
                <Button colorScheme="teal" variant="outline" onClick={onOpen}>
                  Connect to a wallet
                </Button>
              </Box>
            )}
          </SimpleGrid>
        </Container>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Connect to a wallet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Button
                sx={{
                  justifyContent: 'space-between',
                  width: '100%',
                  mb: 4,
                }}
                size="lg"
                variant="outline"
                rightIcon={
                  <Image
                    sx={{ maxWidth: '20px' }}
                    src="/images/logo-metamask.png"
                    alt="MetaMask"
                  />
                }
                onClick={() => {
                  activateBrowserWallet()
                }}
              >
                MetaMask
              </Button>
              <Button
                sx={{
                  justifyContent: 'space-between',
                  width: '100%',
                  mb: 4,
                }}
                size="lg"
                variant="outline"
                rightIcon={
                  <Image
                    sx={{ maxWidth: '20px' }}
                    src="/images/logo-walletconnect.svg"
                    alt="WalletConnect"
                  />
                }
                onClick={() => {
                  activate(walletconnect)
                }}
              >
                WalletConnect
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </header>
      <main>
        <Container sx={{ maxWidth: 'container.xl' }}>
          {children}
          {notifications.map((notification) => {
            if (notification.type === 'walletConnected') {
              return null
            }
            return (
              <Alert
                key={notification.id}
                status="success"
                sx={{ position: 'fixed', bottom: 8, right: 8, width: '400px' }}
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {TRANSACTION_TITLES[notification.type]}
                  </AlertTitle>
                  <AlertDescription sx={{ overflow: 'hidden' }}>
                    Transaction Hash:{' '}
                    {truncateHash(notification.transaction.hash, 61)}
                  </AlertDescription>
                </Box>
              </Alert>
            )
          })}
        </Container>
      </main>
      <footer>
        <Container sx={{ mt: 8, py: 8, maxWidth: 'container.xl' }}>
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

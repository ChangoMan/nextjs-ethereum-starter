import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import blockies from 'blockies-ts'
import { providers } from 'ethers'
import React from 'react'
import {
  useEagerConnect,
  useInactiveListener,
} from '../../hooks/web3-react-hooks'
import { injected } from '../../lib/connectors'
import Button from '../Button'
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

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const context = useWeb3React<providers.Web3Provider>()
  const {
    connector,
    // library,
    // chainId,
    account,
    activate,
    deactivate,
    // active,
    error,
  } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <div className="container mx-auto px-6">
          <div className="py-8 flex items-center">
            {account ? (
              <div className="ml-auto flex items-center">
                <img src={blockieImageSrc} alt="blockie" />
                <p className="mx-4">{account}</p>
                <Button
                  onClick={() => {
                    deactivate()
                  }}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                className="ml-auto"
                onClick={() => {
                  setActivatingConnector(injected)
                  activate(injected)
                }}
              >
                Connect To MetaMask
              </Button>
            )}
          </div>
          {!!error && (
            <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>
              {getErrorMessage(error)}
            </h4>
          )}
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <div className="container mx-auto px-6 py-8">
          <p>
            Built by{' '}
            <a
              className="text-gray-900 dark:text-white"
              href="https://twitter.com/huntarosan"
            >
              Hunter Chang
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}

export default Layout

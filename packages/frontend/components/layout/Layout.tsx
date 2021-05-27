import { useEthers } from '@usedapp/core'
import blockies from 'blockies-ts'
import React from 'react'
import Balance from '../Balance'
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
        <div className="container mx-auto px-6">
          <div className="py-8 flex items-center">
            {account ? (
              <div className="ml-auto flex items-center">
                <Balance />
                <img className="ml-4" src={blockieImageSrc} alt="blockie" />
                <p className="mx-4 mb-0">
                  {account.replace(account.substring(6, 38), '...')}
                </p>
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
                  activateBrowserWallet()
                }}
              >
                Connect To MetaMask
              </Button>
            )}
          </div>
          {error && <p>{error}</p>}
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

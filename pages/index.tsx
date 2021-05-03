import WalletConnectProvider from '@walletconnect/web3-provider'
import { ethers, providers } from 'ethers'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

// Update with the contract address logged out to the CLI when it was deployed
const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

let web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true, // optional
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: 'INFURA_ID', // required
        },
      },
    },
  })
}

const onConnect = async () => {
  const provider = await web3Modal.connect()
  const web3Provider = new providers.Web3Provider(provider)
  // eslint-disable-next-line no-console
  console.log(web3Provider)
}

export const Home = (): JSX.Element => {
  // Track the greeting from the blockchain
  const [greeting, setGreeting] = useState('')
  // Track the greetingInputValue from the input
  const [greetingInputValue, setGreetingInputValue] = useState('')

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onConnect()
    }
  }, [])

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchContractGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        GREETER_ADDRESS,
        Greeter.abi,
        provider
      )
      try {
        const data = await contract.greet()
        // eslint-disable-next-line no-console
        console.log('greetingInputValue: ', data)
        setGreeting(data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

  // call the smart contract, send an update
  async function setContractGreeting() {
    if (!greetingInputValue) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greetingInputValue)
      await transaction.wait()
      fetchContractGreeting()
    }
  }

  return (
    <div>
      <Head>
        <title>Scaffold ETH - Next.js - Typescript - Tailwind CSS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <div className="container mx-auto">
          <div className="px-6 py-8">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onConnect}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="container mx-auto">
          <div className="px-6 py-8">
            <div>
              <p className="mb-3 text-xl">Greeting: {greeting}</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={fetchContractGreeting}
              >
                Fetch Greeting
              </button>
            </div>
            <div className="mt-12">
              <input
                type="text"
                onChange={(e) => setGreetingInputValue(e.target.value)}
                placeholder="Enter a Greeting"
              />
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={setContractGreeting}
                >
                  Set Greeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

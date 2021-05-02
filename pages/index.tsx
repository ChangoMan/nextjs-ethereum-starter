import { ethers } from 'ethers'
import Head from 'next/head'
import { useState } from 'react'
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json'

// Update with the contract address logged out to the CLI when it was deployed
const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

export const Home = (): JSX.Element => {
  // Track the greeting from the blockchain
  const [blockchainGreeting, setBlockchainGreeting] = useState('')

  // Track the greetingValue from the input
  const [greetingValue, setGreetingValue] = useState('')

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
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
        console.log('greetingValue: ', data)
        setBlockchainGreeting(data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greetingValue) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greetingValue)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div>
      <Head>
        <title>Scaffold ETH - Next.js - Typescript - Tailwind CSS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="container mx-auto">
          <div className="px-6 py-8">
            <div>
              <p className="mb-3 text-xl">Greeting: {blockchainGreeting}</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={fetchGreeting}
              >
                Fetch Greeting
              </button>
            </div>
            <div className="mt-12">
              <input
                type="text"
                onChange={(e) => setGreetingValue(e.target.value)}
                placeholder="Enter a Greeting"
              />
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={setGreeting}
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

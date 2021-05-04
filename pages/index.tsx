import WalletConnectProvider from '@walletconnect/web3-provider'
import blockies from 'blockies-ts'
import { ethers, providers } from 'ethers'
import Head from 'next/head'
import { useCallback, useEffect, useReducer } from 'react'
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

// web3Modal is used to connect to various wallets.
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

type StateType = {
  greeting: string
  inputValue: string
  web3Provider: any
  address?: string
  connected: boolean
}
type ActionType =
  | {
      type: 'SET_GREETING'
      greeting: string
    }
  | {
      type: 'SET_INPUT_VALUE'
      inputValue: string
    }
  | {
      type: 'SET_WEB3_PROVIDER'
      web3Provider: any
      address?: string
    }

const initialState: StateType = {
  greeting: '',
  inputValue: '',
  web3Provider: null,
  address: null,
  connected: false,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the greeting from the blockchain
    case 'SET_GREETING':
      return {
        ...state,
        greeting: action.greeting,
      }
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.inputValue,
      }
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        web3Provider: action.web3Provider,
        address: action.address,
        connected: true,
      }
    default:
      throw new Error()
  }
}

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const onWeb3Connect = useCallback(async () => {
    const provider = await web3Modal.connect()
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()
    dispatch({
      type: 'SET_WEB3_PROVIDER',
      web3Provider,
      address,
    })
  }, [])

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      onWeb3Connect()
    }
  }, [onWeb3Connect])

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchContractGreeting() {
    if (state.web3Provider) {
      // const provider = new providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        GREETER_ADDRESS,
        Greeter.abi,
        state.web3Provider
      )
      try {
        const data = await contract.greet()
        dispatch({ type: 'SET_GREETING', greeting: data })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

  // call the smart contract, send an update
  async function setContractGreeting() {
    if (!state.inputValue) return
    if (state.web3Provider) {
      await requestAccount()
      // const provider = new providers.Web3Provider(window.ethereum)
      const signer = state.web3Provider.getSigner()
      const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, signer)
      const transaction = await contract.setGreeting(state.inputValue)
      await transaction.wait()
      fetchContractGreeting()
    }
  }

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: state.address }).toDataURL()
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
            <div className="flex items-center">
              {state.address ? (
                <div className="ml-auto flex items-center">
                  <img src={blockieImageSrc} alt="blockie" />
                  <p className="ml-4">{state.address}</p>
                </div>
              ) : (
                <button
                  type="button"
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onWeb3Connect}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="container mx-auto">
          <div className="px-6 py-8">
            <div>
              <p className="mb-3 text-xl">Greeting: {state.greeting}</p>
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
                placeholder="Enter a Greeting"
                onChange={(e) => {
                  dispatch({
                    type: 'SET_INPUT_VALUE',
                    inputValue: e.target.value,
                  })
                }}
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

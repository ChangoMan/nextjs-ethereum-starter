import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import blockies from 'blockies-ts'
import { ethers, providers } from 'ethers'
import Head from 'next/head'
import React, { useReducer } from 'react'
import Button from '../components/Button'
import Signature from '../components/Signature'
import TheGraphQuery from '../components/TheGraphQuery'
import { useEagerConnect, useInactiveListener } from '../hooks/web3-react-hooks'
import { injected } from '../lib/connectors'
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

// Update with the contract address logged out to the CLI when it was deployed
const GREETER_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

type StateType = {
  greeting: string
  inputValue: string
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

const initialState: StateType = {
  greeting: '',
  inputValue: '',
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
    default:
      throw new Error()
  }
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

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const context = useWeb3React<providers.Web3Provider>()
  const {
    connector,
    library,
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

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchContractGreeting() {
    if (library) {
      // const provider = new providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        GREETER_ADDRESS,
        Greeter.abi,
        library
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
    if (library) {
      await requestAccount()
      // const provider = new providers.Web3Provider(window.ethereum)
      const signer = library.getSigner()
      const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, signer)
      const transaction = await contract.setGreeting(state.inputValue)
      await transaction.wait()
      fetchContractGreeting()
    }
  }

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
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
        </div>
      </header>

      <main>
        <div className="container mx-auto">
          <div className="px-6 py-8">
            <div>
              <h2 className="mt-12 mb-8 font-semibold text-lg">
                Greeting Component
              </h2>
              <p className="mb-3 text-xl">Greeting: {state.greeting}</p>
              <Button onClick={fetchContractGreeting}>Fetch Greeting</Button>
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
                <Button onClick={setContractGreeting}>Set Greeting</Button>
              </div>
            </div>
            <hr className="my-8" />
            <Signature />
            <hr className="my-8" />
            <TheGraphQuery />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

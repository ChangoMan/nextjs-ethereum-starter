import WalletConnectProvider from '@walletconnect/web3-provider'
import blockies from 'blockies-ts'
import { ethers, providers } from 'ethers'
import Head from 'next/head'
import { useCallback, useEffect, useReducer } from 'react'
import Web3Modal from 'web3modal'
import Button from '../components/Button'
import Signature from '../components/Signature'
import TheGraphQuery from '../components/TheGraphQuery'
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
  | {
      type: 'SET_ADDRESS'
      address?: string
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
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
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'RESET_WEB3_PROVIDER':
      return {
        ...state,
        web3Provider: null,
        address: null,
        connected: false,
      }
    default:
      throw new Error()
  }
}

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // const resetApp = useCallback(async () => {
  //   if (
  //     state.web3Provider &&
  //     state.web3Provider.currentProvider &&
  //     state.web3Provider.currentProvider.close
  //   ) {
  //     await state.web3Provider.currentProvider.close()
  //   }
  //   await web3Modal.clearCachedProvider()
  //   dispatch({
  //     type: 'RESET_WEB3_PROVIDER',
  //   })
  //   // this.setState({ ...INITIAL_STATE });
  // }, [state.web3Provider])

  // From https://github.com/Web3Modal/web3modal/blob/master/example/src/App.tsx
  const subscribeProvider = useCallback(async (provider: any) => {
    if (!provider.on) {
      return
    }

    // provider.on('disconnect', () => resetApp())

    provider.on('accountsChanged', async (accounts: string[]) => {
      dispatch({
        type: 'SET_ADDRESS',
        address: accounts[0],
      })
    })
    // provider.on("chainChanged", async (chainId: number) => {
    //   const { web3 } = this.state;
    //   const networkId = await web3.eth.net.getId();
    //   await this.setState({ chainId, networkId });
    //   // await this.getAccountAssets();
    // });

    // provider.on("networkChanged", async (networkId: number) => {
    //   const { web3 } = this.state;
    //   const chainId = await web3.eth.chainId();
    //   await this.setState({ chainId, networkId });
    //   // await this.getAccountAssets();
    // });
  }, [])

  const onWeb3Connect = useCallback(async () => {
    const provider = await web3Modal.connect()
    await subscribeProvider(provider)
    const web3Provider = new providers.Web3Provider(provider)
    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()
    dispatch({
      type: 'SET_WEB3_PROVIDER',
      web3Provider,
      address,
    })
  }, [subscribeProvider])

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
                <Button onClick={onWeb3Connect}>Connect Wallet</Button>
              )}
            </div>
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
            <Signature web3Provider={state.web3Provider} />
            <hr className="my-8" />
            <TheGraphQuery />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home

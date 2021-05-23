import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import React, { useReducer } from 'react'
import Button from '../components/Button'
import Layout from '../components/layout/Layout'
import Greeter from '../src/artifacts/contracts/Greeter.sol/Greeter.json'

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

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { library } = useWeb3React()

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

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="px-6 py-8">
          <p className="mb-3 text-xl">Greeting: {state.greeting}</p>
          <Button onClick={fetchContractGreeting}>Fetch Greeting</Button>
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
        </div>
      </div>
    </Layout>
  )
}

export default Home

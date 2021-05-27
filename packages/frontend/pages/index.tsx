import { Box, Button, Container, Input, Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { ethers, providers, utils } from 'ethers'
import React, { useReducer } from 'react'
import Greeter from '../artifacts/contracts/Greeter.sol/Greeter.json'
import Layout from '../components/layout/Layout'

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

const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

export const Home = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, library } = useEthers()

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

  async function sendFunds() {
    if (account) {
      const signer = localProvider.getSigner()
      try {
        const result = await signer.sendTransaction({
          to: account,
          value: utils.parseEther('0.01'),
        })
        // eslint-disable-next-line no-console
        console.log(result)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      }
    }
  }

  return (
    <Layout>
      <Container maxW="container.xl">
        <Box maxW="container.sm">
          <Box>
            <Text>Greeting: {state.greeting}</Text>
            <Button
              sx={{ mt: 2 }}
              colorScheme="teal"
              onClick={fetchContractGreeting}
            >
              Fetch Greeting
            </Button>
          </Box>
          <Box sx={{ mt: 8 }}>
            <Input
              type="text"
              placeholder="Enter a Greeting"
              onChange={(e) => {
                dispatch({
                  type: 'SET_INPUT_VALUE',
                  inputValue: e.target.value,
                })
              }}
            />
            <Button
              sx={{ mt: 2 }}
              colorScheme="teal"
              onClick={setContractGreeting}
            >
              Set Greeting
            </Button>
          </Box>
          <Button sx={{ mt: 8 }} colorScheme="teal" onClick={sendFunds}>
            Send Funds From Local Hardhat Chain
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}

export default Home

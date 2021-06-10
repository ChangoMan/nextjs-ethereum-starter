import { Box, Button, Divider, Heading, Input, Text } from '@chakra-ui/react'
import { useEthers, useSendTransaction } from '@usedapp/core'
import { ethers, providers, utils } from 'ethers'
import React, { useReducer } from 'react'
import { CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import YourContract from '../artifacts/contracts/YourContract.sol/YourContract.json'
import Layout from '../components/layout/Layout'

/**
 * Constants & Helpers
 */

const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

/**
 * Prop Types
 */
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

/**
 * Component
 */
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

export const HomeIndex = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, library } = useEthers()

  // Use the localProvider as the signer to send ETH to our wallet
  const { sendTransaction } = useSendTransaction({
    signer: localProvider.getSigner(),
  })

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  // call the smart contract, read the current greeting value
  async function fetchContractGreeting() {
    if (library) {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        YourContract.abi,
        library
      )
      try {
        const data = await contract.greeting()
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
      const signer = library.getSigner()
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        YourContract.abi,
        signer
      )
      const transaction = await contract.setGreeting(state.inputValue)
      await transaction.wait()
      fetchContractGreeting()
    }
  }

  function sendFunds() {
    sendTransaction({
      to: account,
      value: utils.parseEther('0.1'),
    })
  }

  return (
    <Layout>
      <Heading as="h1" sx={{ mb: 8 }}>
        Next.js Ethereum Starter
      </Heading>
      <Text sx={{ fontSize: 'xl' }}>
        This page only works locally with a Hardhat node running.
      </Text>
      <Box sx={{ maxWidth: 'container.sm', p: 8, mt: 8, bg: 'gray.100' }}>
        <Text sx={{ fontSize: 'xl' }}>
          Contract Address: {CONTRACT_ADDRESS}
        </Text>
        <Divider sx={{ my: 8, borderColor: 'gray.400' }} />
        <Box>
          <Text sx={{ fontSize: 'lg' }}>Greeting: {state.greeting}</Text>
          <Button
            sx={{ mt: 2 }}
            colorScheme="teal"
            onClick={fetchContractGreeting}
          >
            Fetch Greeting
          </Button>
        </Box>
        <Divider sx={{ my: 8, borderColor: 'gray.400' }} />
        <Box>
          <Input
            sx={{ bg: 'white' }}
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
        <Divider sx={{ my: 8, borderColor: 'gray.400' }} />
        <Button colorScheme="teal" onClick={sendFunds}>
          Send Funds From Local Hardhat Chain
        </Button>
      </Box>
    </Layout>
  )
}

export default HomeIndex

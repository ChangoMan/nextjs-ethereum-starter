import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { ethers, providers } from 'ethers'
import type { NextPage } from 'next'
import { useCallback, useEffect, useReducer } from 'react'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useProvider,
} from 'wagmi'
import { YourContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import YourContract from '../artifacts/contracts/YourContract.sol/YourContract.json'
import { Layout } from '../components/layout/Layout'
import { YourContract as YourContractType } from '../types/typechain'

/**
 * Constants & Helpers
 */

const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

const ROPSTEN_CONTRACT_ADDRESS = '0x6b61a52b1EA15f4b8dB186126e980208E1E18864'

/**
 * Prop Types
 */
type StateType = {
  greeting: string
  inputValue: string
  isLoading: boolean
  isLocalChain: boolean
}
type ActionType =
  | {
      type: 'SET_GREETING'
      greeting: StateType['greeting']
    }
  | {
      type: 'SET_INPUT_VALUE'
      inputValue: StateType['inputValue']
    }
  | {
      type: 'SET_LOADING'
      isLoading: StateType['isLoading']
    }
  | {
      type: 'SET_IS_LOCAL_CHAIN'
      isLocalChain: StateType['isLocalChain']
    }

/**
 * Component
 */
const initialState: StateType = {
  greeting: '',
  inputValue: '',
  isLoading: false,
  isLocalChain: false,
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
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case 'SET_IS_LOCAL_CHAIN':
      return {
        ...state,
        isLocalChain: action.isLocalChain,
      }
    default:
      throw new Error()
  }
}

const Home: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const CONTRACT_ADDRESS = state.isLocalChain
    ? LOCAL_CONTRACT_ADDRESS
    : ROPSTEN_CONTRACT_ADDRESS

  const { address } = useAccount()
  const { chain } = useNetwork()
  const provider = useProvider()

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: YourContract.abi,
    functionName: 'setGreeting',
    args: state.inputValue,
    enabled: Boolean(state.inputValue),
  })

  const { write } = useContractWrite(config)

  useEffect(() => {
    if (chain && chain.id === 1337) {
      dispatch({ type: 'SET_IS_LOCAL_CHAIN', isLocalChain: true })
    }
  }, [chain])

  // Use the localProvider as the signer to send ETH to our wallet
  const sendFunds = useCallback(async () => {
    const signer = localProvider.getSigner()

    const transaction = await signer.sendTransaction({
      to: address,
      value: ethers.constants.WeiPerEther,
    })

    await transaction.wait()
  }, [address])

  // call the smart contract, read the current greeting value
  async function fetchContractGreeting() {
    if (provider) {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        YourContract.abi,
        provider
      ) as YourContractType
      try {
        const data = await contract.greeting()
        dispatch({ type: 'SET_GREETING', greeting: data })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('Error: ', err)
      }
    }
  }

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Next.js Ethereum Starter
      </Heading>
      <Text fontSize="lg" mb="4">
        Ethereum starter kit made with:
      </Text>
      <UnorderedList mb="8">
        <ListItem>
          <Link href="https://hardhat.org/" color="teal.500" isExternal>
            Hardhat
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://nextjs.org/" color="teal.500" isExternal>
            Next.js
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://www.rainbowkit.com/" color="teal.500" isExternal>
            RainbowKit
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://wagmi.sh/" color="teal.500" isExternal>
            wagmi Hooks
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://chakra-ui.com" color="teal.500" isExternal>
            Chakra UI
          </Link>
        </ListItem>
      </UnorderedList>
      <Button
        as="a"
        size="lg"
        colorScheme="teal"
        variant="outline"
        href="https://github.com/ChangoMan/nextjs-ethereum-starter"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get the source code!
      </Button>

      <Text mt="8" fontSize="xl">
        This page only works on the ROPSTEN Testnet or on a Local Chain.
      </Text>
      <Box maxWidth="container.sm" p="8" mt="8" bg="gray.100">
        <Text fontSize="xl">Contract Address: {CONTRACT_ADDRESS}</Text>
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg">Greeting: {state.greeting}</Text>
          <Button mt="2" colorScheme="teal" onClick={fetchContractGreeting}>
            Fetch Greeting
          </Button>
        </Box>
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg" mb="2">
            Enter a Greeting:
          </Text>
          <Input
            bg="white"
            type="text"
            placeholder="Enter a Greeting"
            onBlur={(e) => {
              dispatch({
                type: 'SET_INPUT_VALUE',
                inputValue: e.target.value,
              })
            }}
          />
          <Button
            mt="2"
            colorScheme="teal"
            isLoading={state.isLoading}
            onClick={() => write?.()}
          >
            Set Greeting
          </Button>
        </Box>
        <Divider my="8" borderColor="gray.400" />
        <Text mb="4">This button only works on a Local Chain.</Text>
        <Button
          colorScheme="teal"
          onClick={sendFunds}
          isDisabled={!state.isLocalChain}
        >
          Send Funds From Local Hardhat Chain
        </Button>
      </Box>
    </Layout>
  )
}

export default Home

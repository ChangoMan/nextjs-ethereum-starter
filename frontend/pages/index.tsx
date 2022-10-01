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
  useToast,
} from '@chakra-ui/react'
import { ethers, providers } from 'ethers'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useEffect, useReducer } from 'react'
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useProvider,
  useWaitForTransaction,
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

const GOERLI_CONTRACT_ADDRESS = '0x3B73833638556f10ceB1b49A18a27154e3828303'

/**
 * Prop Types
 */
type StateType = {
  greeting: string
  inputValue: string
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
      type: 'SET_IS_LOCAL_CHAIN'
      isLocalChain: StateType['isLocalChain']
    }

/**
 * Component
 */
const initialState: StateType = {
  greeting: '',
  inputValue: '',
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
    : GOERLI_CONTRACT_ADDRESS

  const { data: session } = useSession()
  const address = session?.user?.name

  const { chain } = useNetwork()
  const provider = useProvider()

  const toast = useToast()

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: YourContract.abi,
    functionName: 'setGreeting',
    args: state.inputValue,
    enabled: Boolean(state.inputValue),
  })

  const { data, write } = useContractWrite(config)

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log('success data', data)
      toast({
        title: 'Transaction Successful',
        description: (
          <>
            <Text>Successfully updated the Greeting!</Text>
            <Text>
              <Link
                href={`https://goerli.etherscan.io/tx/${data?.blockHash}`}
                isExternal
              >
                View on Etherscan
              </Link>
            </Text>
          </>
        ),
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  useEffect(() => {
    if (chain && chain.id === 1337) {
      dispatch({ type: 'SET_IS_LOCAL_CHAIN', isLocalChain: true })
    }
  }, [chain])

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
        This page only works on the GOERLI Testnet or on a Local Chain.
      </Text>
      <Box maxWidth="container.sm" p="8" mt="8" bg="gray.100">
        <Text fontSize="xl">Contract Address: {CONTRACT_ADDRESS}</Text>
        <Divider my="8" borderColor="gray.400" />
        <Box>
          <Text fontSize="lg">Greeting: {state.greeting}</Text>
          <Button
            mt="2"
            colorScheme="teal"
            disabled={!address}
            onClick={fetchContractGreeting}
          >
            {address ? 'Fetch Greeting' : 'Please Connect Your Wallet'}
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
            disabled={!address || isLoading}
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
            isLoading={isLoading}
            disabled={!address || isLoading}
            onClick={() => write?.()}
          >
            {address ? 'Set Greeting' : 'Please Connect Your Wallet'}
          </Button>
        </Box>
      </Box>
    </Layout>
  )
}

export default Home

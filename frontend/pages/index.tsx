import {
  Button,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { Layout } from '../components/layout/Layout'

/**
 * Constants & Helpers
 */

const ROPSTEN_CONTRACT_ADDRESS = '0x6b61a52b1EA15f4b8dB186126e980208E1E18864'

/**
 * Prop Types
 */
type StateType = {
  greeting: string
  inputValue: string
  isLoading: boolean
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

/**
 * Component
 */
const initialState: StateType = {
  greeting: '',
  inputValue: '',
  isLoading: false,
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
    default:
      throw new Error()
  }
}

const Home: NextPage = () => {
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
    </Layout>
  )
}

export default Home

import { Button, useToast } from '@chakra-ui/react'
import { ethers, providers } from 'ethers'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

/**
 * Constants & Helpers
 */

const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

/**
 * Component
 */
const Home: NextPage = () => {
  const [isLocalChain, setIsLocalChain] = useState(false)

  const { data: session } = useSession()
  const address = session?.user?.name

  const { chain } = useNetwork()

  const toast = useToast()

  useEffect(() => {
    if (chain && chain.id === 1337) {
      setIsLocalChain(true)
    }
  }, [chain])

  // Use the localProvider as the signer to send ETH to our wallet
  const sendFunds = useCallback(async () => {
    if (address) {
      const signer = localProvider.getSigner()

      const transaction = await signer.sendTransaction({
        to: address,
        value: ethers.constants.WeiPerEther,
      })

      await transaction.wait()

      toast({
        title: 'Transaction Successful',
        description: 'ETH sent from local faucet',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [address, toast])

  return (
    <Button colorScheme="teal" onClick={sendFunds} isDisabled={!isLocalChain}>
      Send Funds From Local Hardhat Chain
    </Button>
  )
}

export default Home

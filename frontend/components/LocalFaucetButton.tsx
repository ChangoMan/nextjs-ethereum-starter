import { Button, useToast } from '@chakra-ui/react'
import { ethers, providers } from 'ethers'
import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useCheckLocalChain } from '../hooks/useCheckLocalChain'

/**
 * Constants & Helpers
 */

const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

/**
 * Component
 */
export const LocalFaucetButton = () => {
  const { address } = useAccount()

  const { isLocalChain } = useCheckLocalChain()

  const toast = useToast()

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

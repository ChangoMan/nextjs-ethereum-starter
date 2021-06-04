import { Text } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'

/**
 * Component
 */
function Balance(): JSX.Element {
  const { account, library } = useEthers()
  const [balance, setBalance] = useState('')

  useEffect(() => {
    async function getBalance() {
      if (library && account) {
        const signer = library.getSigner()
        const signerBalance = await signer.getBalance()
        setBalance(utils.formatEther(signerBalance))
      }
    }
    getBalance()
  }, [library, account])

  return <Text>{balance} ETH</Text>
}

export default Balance

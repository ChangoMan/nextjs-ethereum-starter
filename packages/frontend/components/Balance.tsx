import { Text } from '@chakra-ui/react'
import { useEthers, useNotifications } from '@usedapp/core'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'

/**
 * Component
 */
function Balance(): JSX.Element {
  const { account, library } = useEthers()
  const { notifications } = useNotifications()

  const [balance, setBalance] = useState('')

  useEffect(() => {
    async function getBalance() {
      const signer = library.getSigner()
      const signerBalance = await signer.getBalance()
      setBalance(utils.formatEther(signerBalance))
    }
    if (library && account) {
      getBalance()
    }
  }, [library, account, notifications])

  return <Text>{balance} ETH</Text>
}

export default Balance

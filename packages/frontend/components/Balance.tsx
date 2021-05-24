import { useWeb3React } from '@web3-react/core'
import { utils } from 'ethers'
import { useEffect, useState } from 'react'

function Balance(): JSX.Element {
  const { library } = useWeb3React()
  const [balance, setBalance] = useState('')

  useEffect(() => {
    async function getBalance() {
      if (library) {
        const signer = library.getSigner()
        const signerBalance = await signer.getBalance()
        setBalance(utils.formatEther(signerBalance))
      }
    }
    getBalance()
  }, [library])

  return <p className="mb-0">{balance} ETH</p>
}

export default Balance

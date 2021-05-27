import { useEtherBalance, useEthers } from '@usedapp/core'
import { utils } from 'ethers'

function Balance(): JSX.Element {
  const { account } = useEthers()
  const userBalance = useEtherBalance(account)

  console.log(account)
  console.log(userBalance)

  if (!userBalance) {
    return null
  }

  return <p className="mb-0">{utils.formatEther(userBalance)} ETH</p>
}

export default Balance

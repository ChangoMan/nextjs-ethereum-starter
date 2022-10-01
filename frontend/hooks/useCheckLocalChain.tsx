import { useEffect, useState } from 'react'
import { useNetwork } from 'wagmi'

export const useCheckLocalChain = () => {
  const [isLocalChain, setIsLocalChain] = useState(false)

  const { chain } = useNetwork()

  useEffect(() => {
    if (chain && chain.id === 1337) {
      setIsLocalChain(true)
    }
  }, [chain])

  return {
    isLocalChain,
  }
}

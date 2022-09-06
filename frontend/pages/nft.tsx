import { Button, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from 'wagmi'
import YourNFT from '../artifacts/contracts/YourNFT.sol/YourNFT.json'
import { Layout } from '../components/layout/Layout'

const NftIndex: NextPage = () => {
  const { data: session, status } = useSession()
  const address = session?.user?.name

  const CONTRACT_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

  const { data, isError, isLoading } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: YourNFT.abi,
    functionName: 'balanceOf',
    args: address,
  })

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: YourNFT.abi,
    functionName: 'safeMint',
    args: [address, 'https://github.com/ChangoMan/nextjs-ethereum-starter'],
  })

  const { write } = useContractWrite(config)

  return (
    <Layout>
      <Heading as="h1" mb="8">
        NftIndex
      </Heading>
      <Button colorScheme="teal" onClick={() => write?.()}>
        Mint NFT
      </Button>
    </Layout>
  )
}

export default NftIndex

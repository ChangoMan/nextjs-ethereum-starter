import { Button, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import YourNFT from '../artifacts/contracts/YourNFT.sol/YourNFT.json'
import { Layout } from '../components/layout/Layout'

const NftIndex: NextPage = () => {
  const { data: session, status } = useSession()
  const address = session?.user?.name

  const CONTRACT_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: YourNFT.abi,
    functionName: 'safeMint',
    args: [address, 'https://game.example/item-id-8u5h2m.json'],
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

import { Button, Heading } from '@chakra-ui/react'
import { create } from 'ipfs-http-client'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import YourNFT from '../artifacts/contracts/YourNFT.sol/YourNFT.json'
import { Layout } from '../components/layout/Layout'
import { generateTokenUri } from '../utils/generateTokenUri'

const CONTRACT_ADDRESS = '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512'

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

const IPFS_BASE_URL = 'https://ipfs.io/ipfs'

const projectId = '2DDHiA47zFkJXtnxzl2jFkyuaoq'
const projectSecret = '96a91eeafc0a390ab66e6a87f61152aa'
const projectIdAndSecret = `${projectId}:${projectSecret}`

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
      'base64'
    )}`,
  },
})

const NftIndex: NextPage = () => {
  const [nftUri, setNftUri] = useState('')

  const hasNftUri = Boolean(nftUri)

  const { data: session } = useSession()
  const address = session?.user?.name

  const { data: nftBalanceData } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: YourNFT.abi,
    functionName: 'balanceOf',
    args: address,
  })

  const { data: nftTokenUri } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: YourNFT.abi,
    functionName: 'tokenURI',
    args: '4',
  })

  console.log('nftBalanceData', nftBalanceData)
  console.log('nftTokenUri', nftTokenUri)

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: YourNFT.abi,
    functionName: 'safeMint',
    args: [address, nftUri],
    enabled: hasNftUri,
  })

  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log('success data', data)
      setNftUri('')
    },
  })

  const mintItem = useCallback(async () => {
    const fetchImage = async () => {
      const response = await fetch(
        `https://api.unsplash.com/photos/random/?client_id=${UNSPLASH_ACCESS_KEY}`
      )

      if (!response.ok) {
        throw Error('Error with fetch')
      }

      const data = await response.json()
      return data
    }

    try {
      // Fetch a random photo fron Unsplash
      const photos = await fetchImage()

      // Convert that photo into `tokenURI` metadata
      const tokenURI = generateTokenUri(photos)

      // Upload the `tokenURI` to IPFS
      const uploaded = await ipfs.add(tokenURI)

      // // This will trigger the useEffect to run the `write()` function.
      setNftUri(`${IPFS_BASE_URL}/${uploaded.path}`)
    } catch (error) {
      console.log('error', error)
    }
  }, [])

  useEffect(() => {
    if (hasNftUri && write) {
      write()
    }
  }, [hasNftUri, write])

  return (
    <Layout>
      <Heading as="h1" mb="8">
        NftIndex
      </Heading>
      <Button colorScheme="teal" onClick={mintItem}>
        Mint NFT
      </Button>
    </Layout>
  )
}

export default NftIndex

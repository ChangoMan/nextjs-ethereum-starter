import {
  Box,
  Button,
  Divider,
  Heading,
  Link,
  Text,
  useToast,
} from '@chakra-ui/react'
import { create } from 'ipfs-http-client'
import type { NextPage } from 'next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { YourNFTContract as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import YourNFT from '../artifacts/contracts/YourNFT.sol/YourNFT.json'
import { Layout } from '../components/layout/Layout'
import { NftList } from '../components/NftList'
import { useCheckLocalChain } from '../hooks/useCheckLocalChain'
import { useIsMounted } from '../hooks/useIsMounted'
import { generateTokenUri } from '../utils/generateTokenUri'

const GOERLI_CONTRACT_ADDRESS = '0x982659f8ce3988096A735044aD42445D6514ba7e'

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

  const { isLocalChain } = useCheckLocalChain()

  const { isMounted } = useIsMounted()

  const hasNftUri = Boolean(nftUri)

  const CONTRACT_ADDRESS = isLocalChain
    ? LOCAL_CONTRACT_ADDRESS
    : GOERLI_CONTRACT_ADDRESS

  const { address } = useAccount()

  const toast = useToast()

  const CONTRACT_CONFIG = useMemo(() => {
    return {
      address: CONTRACT_ADDRESS,
      abi: YourNFT.abi,
    }
  }, [CONTRACT_ADDRESS])

  // Gets the total number of NFTs owned by the connected address.
  const { data: nftBalanceData, refetch: refetchNftBalanceData } =
    useContractRead({
      ...CONTRACT_CONFIG,
      functionName: 'balanceOf',
      args: address ? [address] : undefined,
    })

  // Creates the contracts array for `nftTokenIds`
  const tokenOwnerContractsArray = useMemo(() => {
    let contractCalls = []

    if (nftBalanceData && nftBalanceData.toNumber) {
      const nftBalance = nftBalanceData.toNumber()

      for (let tokenIndex = 0; tokenIndex < nftBalance; tokenIndex++) {
        const contractObj = {
          ...CONTRACT_CONFIG,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, tokenIndex],
        }

        contractCalls.push(contractObj)
      }
    }

    return contractCalls
  }, [CONTRACT_CONFIG, address, nftBalanceData])

  // Gets all of the NFT tokenIds owned by the connected address.
  const { data: nftTokenIds } = useContractReads({
    contracts: tokenOwnerContractsArray,
    enabled: tokenOwnerContractsArray.length > 0,
  })

  // Creates the contracts array for `nftTokenUris`
  const tokenUriContractsArray = useMemo(() => {
    if (!nftTokenIds || nftTokenIds.length === 0) {
      return []
    }

    const contractCalls = nftTokenIds?.map((tokenId) => {
      return {
        ...CONTRACT_CONFIG,
        functionName: 'tokenURI',
        args: tokenId ? [tokenId] : undefined,
      }
    })

    return contractCalls
  }, [CONTRACT_CONFIG, nftTokenIds])

  // Gets all of the NFT tokenUris owned by the connected address.
  const { data: nftTokenUris } = useContractReads({
    contracts: tokenUriContractsArray,
    enabled: tokenUriContractsArray.length > 0,
  })

  const { config } = usePrepareContractWrite({
    ...CONTRACT_CONFIG,
    functionName: 'safeMint',
    args: [address, nftUri],
    enabled: hasNftUri,
  })

  const { data, write } = useContractWrite(config)

  const { isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      console.log('success data', data)
      setNftUri('')
      toast({
        title: 'Transaction Successful',
        description: (
          <>
            <Text>Successfully minted your NFT!</Text>
            <Text>
              <Link
                href={`https://goerli.etherscan.io/tx/${data?.blockHash}`}
                isExternal
              >
                View on Etherscan
              </Link>
            </Text>
          </>
        ),
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      refetchNftBalanceData()
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
      // Fetch a random photo from Unsplash
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

  if (!isMounted) {
    return null
  }

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Mint NFT
      </Heading>
      <Text mt="8" fontSize="xl">
        This page only works on the GOERLI Testnet or on a Local Chain.
      </Text>
      <Box p="8" mt="8" bg="gray.100">
        <Text fontSize="xl" textAlign="center">
          Contract Address: {CONTRACT_ADDRESS}
        </Text>
        <Divider my="8" borderColor="gray.400" />
        <Text textAlign="center">
          <Button
            colorScheme="teal"
            size="lg"
            disabled={!address || isLoading}
            onClick={mintItem}
            isLoading={isLoading}
          >
            {address ? 'Mint NFT' : 'Please Connect Your Wallet'}
          </Button>
        </Text>
        <Divider my="8" borderColor="gray.400" />
        {nftTokenUris && (
          <NftList address={address} ipfs={ipfs} nftTokenUris={nftTokenUris} />
        )}
      </Box>
    </Layout>
  )
}

export default NftIndex

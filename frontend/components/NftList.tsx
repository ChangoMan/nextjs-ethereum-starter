import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { Result } from '@ethersproject/abi'
import { IPFSHTTPClient } from 'ipfs-http-client'
import { useEffect, useState } from 'react'

interface NftListProps {
  address?: string | null
  ipfs: IPFSHTTPClient
  nftTokenUris: Array<Result>
}

type NftMetadataType = {
  description: string
  image: string
  name: string
}

export const NftList = ({
  address,
  ipfs,
  nftTokenUris,
}: NftListProps): JSX.Element => {
  const [nfts, setNfts] = useState<Array<NftMetadataType>>([])

  useEffect(() => {
    const fetchNftData = async (ipfsHash: string) => {
      try {
        const resp = await ipfs.cat(ipfsHash)
        let content: Array<number> = []

        for await (const chunk of resp) {
          content = [...content, ...chunk]
        }

        const raw = Buffer.from(content).toString('utf8')

        return JSON.parse(raw)
      } catch (error) {
        console.log('error', error)
      }
    }

    const processTokenUris = async () => {
      const nftData = await Promise.all(
        nftTokenUris.map(async (tokenUri) => {
          const ipfsHash = tokenUri.replace('https://ipfs.io/ipfs/', '')
          const ipfsData = await fetchNftData(ipfsHash)
          return ipfsData
        })
      )

      setNfts(nftData)
    }
    processTokenUris()
  }, [ipfs, nftTokenUris])

  if (nftTokenUris.length === 0) {
    return (
      <Alert status="warning">
        <AlertIcon />
        No NFTs associated with your address: {address}
      </Alert>
    )
  }

  return (
    <div>
      <SimpleGrid my="6" columns={[1, 1, 2]} gap="6">
        {nfts.map((nft) => {
          return (
            <Flex
              key={nft.image}
              p="4"
              gap="4"
              alignItems="center"
              backgroundColor="white"
              border="1px"
              borderColor="gray.300"
            >
              <Image
                boxSize={[100, 100, 200]}
                objectFit="cover"
                src={nft.image}
                alt={nft.name}
              />
              <Box>
                <Text fontSize="lg" fontWeight="semibold">
                  {nft.name}
                </Text>
                <Text>{nft.description}</Text>
              </Box>
            </Flex>
          )
        })}
      </SimpleGrid>
    </div>
  )
}

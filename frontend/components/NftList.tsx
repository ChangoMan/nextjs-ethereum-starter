import { Alert, AlertIcon, Box, Image, Text } from '@chakra-ui/react'
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
      {nfts.map((nft) => {
        return (
          <Box my="6" key={nft.image}>
            <Image
              boxSize="100px"
              objectFit="cover"
              src={nft.image}
              alt={nft.name}
            />
            <Text>{nft.name}</Text>
          </Box>
        )
      })}
    </div>
  )
}

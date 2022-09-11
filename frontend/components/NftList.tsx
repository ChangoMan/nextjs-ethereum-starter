import { Alert, AlertIcon, Text } from '@chakra-ui/react'
import { Result } from '@ethersproject/abi'
import { IPFSHTTPClient } from 'ipfs-http-client'
import { useEffect, useState } from 'react'

interface NftListProps {
  address?: string | null
  ipfs: IPFSHTTPClient
  nftTokenUris: Array<Result>
}

export const NftList = ({
  address,
  ipfs,
  nftTokenUris,
}: NftListProps): JSX.Element => {
  const [nfts, setNfts] = useState(['hello'])

  console.log('nftTokenUris', nftTokenUris)

  useEffect(() => {
    const fetchNftData = async () => {
      try {
        const resp = await ipfs.cat(
          'QmUpjCcZbd3Y4PH9rWay9Gae2pRShVwWHfE626rPpLncmd'
        )

        let content = []
        for await (const chunk of resp) {
          content = [...content, ...chunk]
        }

        const raw = Buffer.from(content).toString('utf8')
        console.log(JSON.parse(raw))
      } catch (error) {
        console.log('error', error)
      }
    }

    fetchNftData()
  }, [ipfs])

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
        return <Text key={nft}>{nft}</Text>
      })}
    </div>
  )
}

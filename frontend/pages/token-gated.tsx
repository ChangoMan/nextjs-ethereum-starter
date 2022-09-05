import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Code,
  Heading,
  Link,
  Text,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { erc721ABI, useContractRead } from 'wagmi';
import { Layout } from '../components/layout/Layout';

const TokenGated: NextPage = () => {
  const { data: session, status } = useSession();
  const address = session?.user?.name;

  const isAuthenticated = status === 'authenticated';

  const [hasNft, setHasNft] = useState(false);

  const { data, isError, isLoading } = useContractRead({
    addressOrName: '0x13Bd2ac3779cBbCb2aC874C33f1145DD71Ce41ee',
    contractInterface: erc721ABI,
    functionName: 'balanceOf',
    args: address,
  });

  useEffect(() => {
    if (!isLoading && data && data.toNumber) {
      const numberOfNfts = data.toNumber();

      if (numberOfNfts > 0) {
        setHasNft(true);
      }
    }
  }, [data, isLoading]);

  const sharedDescription = (
    <Text mb="4" fontSize="lg">
      This page will check your authenticated user&apos;s address for a
      particular NFT. For demo purposes, this is checking for the{' '}
      <Link
        href="https://etherscan.io/address/0x13bd2ac3779cbbcb2ac874c33f1145dd71ce41ee"
        color="teal.500"
        isExternal
      >
        CompanionInABox (CBOX)
      </Link>{' '}
      Token.
    </Text>
  );

  if (!isAuthenticated) {
    return (
      <Layout>
        <Heading as="h1" mb="8">
          Unauthenticated
        </Heading>
        {sharedDescription}
        <Text fontSize="lg">Please connect a wallet</Text>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Heading as="h1" mb="8">
          Token Gated Page
        </Heading>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>
            There was an error trying to fetch your NFT.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  if (!hasNft) {
    return (
      <Layout>
        <Heading as="h1" mb="8">
          Token Gated Page
        </Heading>
        {sharedDescription}
        <Text mb="4" fontSize="lg">
          Authenticated as <Code colorScheme="orange">{address}</Code>
        </Text>
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>Access Denied:</AlertTitle>
          <AlertDescription>You do not have the NFT.</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Token Gated Page
      </Heading>
      {sharedDescription}
      <Text mb="4" fontSize="lg">
        Authenticated as: <Code colorScheme="orange">{address}</Code>
      </Text>
      <Alert status="success">
        <AlertIcon />
        <AlertTitle>Access Granted:</AlertTitle>
        <AlertDescription>You have the NFT!</AlertDescription>
      </Alert>
    </Layout>
  );
};

export default TokenGated;

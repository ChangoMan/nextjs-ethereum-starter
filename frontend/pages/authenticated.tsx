import { Code, Heading, Link, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { Layout } from '../components/layout/Layout';

const Authenticated: NextPage = () => {
  const { data: session, status } = useSession();
  const address = session?.user?.name;

  const sharedDescription = (
    <Text mb="4" fontSize="lg">
      This page uses{' '}
      <Link href="https://login.xyz/" color="teal.500" isExternal>
        Sign-In with Ethereum
      </Link>{' '}
      to create an authenticated user session.
    </Text>
  );

  if (status !== 'authenticated') {
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

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Authenticated
      </Heading>
      {sharedDescription}
      <Text fontSize="lg">
        Authenticated as: <Code colorScheme="orange">{address}</Code>
      </Text>
    </Layout>
  );
};

export default Authenticated;

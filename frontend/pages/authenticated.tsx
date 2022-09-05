import { Code, Heading, Text } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { Layout } from '../components/layout/Layout';

const Authenticated: NextPage = () => {
  const { data: session, status } = useSession();
  const { address = '' } = session || {};

  if (status !== 'authenticated') {
    return (
      <Layout>
        <Heading as="h1" mb="8">
          Unauthenticated
        </Heading>
        <Text fontSize="lg">Please connect a wallet</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Authenticated
      </Heading>
      <Text fontSize="lg">
        Authenticated as <Code colorScheme="orange">{address}</Code>
      </Text>
    </Layout>
  );
};

export default Authenticated;

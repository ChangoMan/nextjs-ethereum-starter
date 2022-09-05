import {
  Button,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { Layout } from '../components/layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <Heading as="h1" mb="8">
        Next.js Ethereum Starter
      </Heading>
      <Text fontSize="lg" mb="4">
        Ethereum starter kit made with:
      </Text>
      <UnorderedList mb="8">
        <ListItem>
          <Link href="https://nextjs.org/" color="teal.500" isExternal>
            Next.js
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://www.rainbowkit.com/" color="teal.500" isExternal>
            RainbowKit
          </Link>
        </ListItem>
        <ListItem>
          <Link href="https://chakra-ui.com" color="teal.500" isExternal>
            Chakra UI
          </Link>
        </ListItem>
      </UnorderedList>
      <Button
        as="a"
        size="lg"
        colorScheme="teal"
        variant="outline"
        href="https://github.com/ChangoMan/nextjs-ethereum-starter"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get the source code!
      </Button>
    </Layout>
  );
};

export default Home;

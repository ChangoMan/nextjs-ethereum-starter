import { Code, Heading, Link, Text } from '@chakra-ui/react'
import type { GetServerSideProps, NextPage } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'
import { Layout } from '../components/layout/Layout'
import { getAuthOptions } from './api/auth/[...nextauth]'

const Authenticated: NextPage<{ session: Session }> = ({ session }) => {
  const { data: clientSession, status } = useSession()
  const address = session?.user?.name || clientSession?.user?.name

  const sharedDescription = (
    <Text mb="4" fontSize="lg">
      This page uses{' '}
      <Link href="https://login.xyz/" color="teal.500" isExternal>
        Sign-In with Ethereum
      </Link>{' '}
      to create an authenticated user session.
    </Text>
  )

  if (status !== 'authenticated') {
    return (
      <Layout>
        <Heading as="h1" mb="8">
          Unauthenticated
        </Heading>
        {sharedDescription}
        <Text fontSize="lg">Please connect a wallet</Text>
      </Layout>
    )
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
  )
}

// Remove server side session if you want a static site.
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      session: await unstable_getServerSession(req, res, getAuthOptions(req)),
    },
  }
}

export default Authenticated

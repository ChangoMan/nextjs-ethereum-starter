import { Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { Layout } from '../components/layout/Layout'

const NftIndex: NextPage = () => {
  const { data: session, status } = useSession()
  const address = session?.user?.name

  return (
    <Layout>
      <Heading as="h1" mb="8">
        NftIndex
      </Heading>
    </Layout>
  )
}

export default NftIndex

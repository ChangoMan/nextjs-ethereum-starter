import { gql, useQuery } from '@apollo/client'

const COMPOUND_MARKETS = gql`
  query GetAllMarkets {
    markets(first: 5) {
      id
      underlyingName
      underlyingSymbol
      underlyingPriceUSD
    }
  }
`

function TheGraphQuery(): JSX.Element {
  const { loading, error, data } = useQuery(COMPOUND_MARKETS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <h2 className="mt-12 font-semibold text-lg">
        This component queries the Compound V2 subgraph
      </h2>
      {data.markets.map(
        ({ id, underlyingName, underlyingSymbol, underlyingPriceUSD }) => (
          <div key={id} className="mt-8">
            <p>Name: {underlyingName}</p>
            <p>Symbol: {underlyingSymbol}</p>
            <p>Price: ${underlyingPriceUSD}</p>
          </div>
        )
      )}
    </div>
  )
}

export default TheGraphQuery

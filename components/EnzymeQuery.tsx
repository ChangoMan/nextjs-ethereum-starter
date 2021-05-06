import { gql, useQuery } from '@apollo/client'

const HOLDING_STATES = gql`
  query GetHoldingStates {
    holdingStates(
      where: { fund: "0x24f3b37934d1ab26b7bda7f86781c90949ae3a79" }
      orderBy: timestamp
      orderDirection: asc
      first: 10
    ) {
      timestamp
      asset {
        symbol
      }
      amount
    }
  }
`

function EnzyneQuery(): JSX.Element {
  const { loading, error, data } = useQuery(HOLDING_STATES)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <h2 className="mt-12 font-semibold text-lg">
        This component queries the Enzyme subgraph
      </h2>
      <p className="mt-4">
        These are the holdings for the fund:
        0x24f3b37934d1ab26b7bda7f86781c90949ae3a79
      </p>
      {data.holdingStates.map(({ amount, asset, timestamp }, index) => (
        <div key={index} className="mt-8">
          <p>Timestamp: {timestamp}</p>
          <p>Asset: {asset.symbol}</p>
          <p>Amount: {amount}</p>
        </div>
      ))}
    </div>
  )
}

export default EnzyneQuery

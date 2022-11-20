# nextjs-ethereum-starter

This project was sponsored by the [BuidlGuidl](https://buidlguidl.com). Please support the BuidlGuidl if this project has been helpful!

---

My iteration of [Austin Griffith's scaffold-eth](https://github.com/austintgriffith/scaffold-eth).
Also inspired by [Nader Dabit's blog post](https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13)

- [Hardhat](https://hardhat.org/)
- [Next.js](https://nextjs.org/)
- [RainbowKit](https://www.rainbowkit.com/)
- [wagmi](https://wagmi.sh/)
- [Chakra UI](https://chakra-ui.com/)

👀 [View the Live Demo](https://nextjs-ethereum-starter.vercel.app/)

## Getting Started

It is recommended to use Yarn to avoid dependency collisions: [Yarn](https://classic.yarnpkg.com/en/docs/install)

```bash
git clone https://github.com/ChangoMan/nextjs-ethereum-starter.git
cd nextjs-ethereum-starter

yarn install

# Start up the Hardhat Network
yarn chain
```

Here we just install the npm project's dependencies, and by running `yarn chain` we spin up an instance of Hardhat Network that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
yarn deploy
```

This will deploy the contract to Hardhat Network. After this completes run:

```bash
cd frontend
yarn install
```

This will install the frontend packages. We also need to set up the local configuration file.

```bash
cp .env.local.example .env.local
```

This will create a file called `.env.local`. Open up that file and fill in the `NEXT_PUBLIC_ALCHEMY_API_KEY=` and `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=` environment variables.

```bash
yarn dev
```

This will start up the Next.js development server. Your site will be available at http://localhost:3000/

To interact with the local contract, be sure to switch your MetaMask Network to `Localhost 8545`

# scaffold-eth-nextjs

This is a work in progress!

My iteration of [Austin Griffith's scaffold-eth](https://github.com/austintgriffith/scaffold-eth). Also inspired by [Nader Dabit]
(https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13)

- [Typescript](https://www.typescriptlang.org/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Linting, typechecking and formatting on by default using [`husky`](https://github.com/typicode/husky) for commit hooks
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)
- Tailwind CSS
- Hardhat
- Ethers.js

## Getting Started

```bash
git clone https://github.com/ChangoMan/scaffold-eth-nextjs.git
cd scaffold-eth-nextjs

yarn install
# or
npm install

# Start up the Hardhat Network
npx hardhat node
```

Here we just install the npm project's dependencies, and by running `npx hardhat node` we spin up an instance of Hardhat Network that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will deploy the contract to Hardhat Network. After this completes run:

```bash
yarn dev
# or
npm run dev
```

This will start up the Next.js development server and your site will be available at http://localhost:3000/

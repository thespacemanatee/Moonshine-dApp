# Moonshine-dApp
 Voting application and protocol on web3

## How to run?

Make sure you have setup `.env` with the following variables:

```
INFURA_API_URL = ""
MNEMONIC = ""
```

In root directory of project (not `./client`), compile and deploy your smart contracts

```bash
ganache-cli

truffle compile

truffle migrate --reset --network development
```

In client directory `./client`, run the following

```bash
yarn

yarn dev
```
### Faucet for OCEAN tokens on test networks

#### Getting started

```bash
# create .env from .env.example

# Install dependencies
npm i

# Start development server on browser
npm start
```

## ENV List

- DB_PATH = specifiy the folder name to use for sqlite
- RPC = rpc connection
- SEED_PHRASE = private key (or seed) used by faucet
- TOKEN_NAME = (optional) token name to be displayed
- TOKEN_AMOUNT = amount of tokens to dispense
- TOKEN_CONTRACT_ADDRESS = token contract address (use 0x0000000000000000000000000000000000000000 to dispense ETH)
- PORT = (optional) default: 4000
- COOLING_PERIOD_IN_HOURS = minimum interval allowed between dispenses
- ETH_BALANCE_LIMIT = If the requesting wallet already has more than this amount of Eth, the request will be denied. Value is in ETH.
- OCEAN_BALANCE_LIMIT = If the requesting wallet already has more than this amount of Ocean, the request will be denied. Value is in ETH.
- BASE_TOKEN_NAME = Name of the base token on the network.

## ✨ Code Style

Code style is automatically enforced through [ESLint](https://eslint.org) & [Prettier](https://prettier.io) rules:

- Git pre-commit hook runs `prettier` on staged files, setup with [Husky](https://typicode.github.io/husky)
- VS Code suggested extensions and settings for auto-formatting on file save

For running linting and auto-formatting manually, you can use from the root of the project:

```bash
# linting check, also runs Typescript typings check
npm run lint

# auto format all files in the project with prettier, taking all configs into account
npm run format
```

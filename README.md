# 📘 Sample Flashbots Sniper & Deployment CLI

This project provides a full boilerplate for deploying and managing a **Uniswap V2 Tax Token** with CLI-based automation, including Flashbots sniping and parameter management.

---

## 🚀 Features

- Deploy a token contract using Hardhat  
- Manually add liquidity via Uniswap UI  
- Run a Flashbots bundle to:  
  - Enable trading  
  - Snipe tokens across multiple wallets  
  - Set buy fees  
- Query and modify contract state (e.g. lower taxes, renounce ownership)  
- Modular architecture with environment-driven config (`.env`)  
- CLI menu to select actions without editing files  

---

## 📁 Project Structure

```
.
├── cli.js                   # Main interactive CLI entrypoint
├── .env                     # Environment variables for config
├── contracts/
│   └── MyToken.sol          # Your ERC-20 tax token contract
├── scripts/
│   ├── tokenDeploy.js       # Deploys the token contract
│   ├── addLiquidity.js      # (optional) Add LP directly via script
│   ├── snipe.js             # Sends a Flashbots bundle to enable trading + snipe
│   ├── token-queries.js     # Modular contract utilities (renounce, tax, etc.)
│   ├── readLpReserves.js    # Reads live ETH/token reserves from LP
│   ├── helpers.js           # Shared logic (sign txs, fee update, swap prep)
│   └── const.js             # Loads config from .env
└── artifacts/               # Auto-generated ABIs after compile
```

---

## ⚙️ Setup

### 1. Clone & install

```bash
git clone https://github.com/yourname/ERC20-Token-Launcher-CLI
cd ERC20-Token-Launcher-CLI
npm install
```

### 2. Configure environment

Create a `.env` file (based on the example below):

```dotenv
# Token settings
CONTRACT_NAME=MyToken
CONTRACT_ADDRESS=0xYourDeployedTokenAddress

# Network RPCs
RPC_URL=https://mainnet.infura.io/v3/your-key
CHAIN_ID=1
FB_RPC_URL=https://relay.flashbots.net

# Uniswap
UNISWAPV2ROUTER02=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
WETH_ADDRESS=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2

# Snipe settings
SNIPER_WALLETS=privKey1,privKey2,privKey3,privKey4
LP_ETH=10
LP_TOKENS=940000000
BUY_PCT=1.9
BUY_FEE_AMOUNT=40
```

> **Note:** Don't prefix private keys with `0x` in `.env`

---

## 📦 Running the CLI

Start the interactive CLI:

```bash
node cli.js
```

You’ll see:

```
What do you want to do?
> 🔫 Snipe a Token
> 🛠️ Deploy a Token Contract
> 🔎 Manage / Modify Token
> ❌ Exit
```

---

## 📌 Recommended Launch Flow

```
1. node cli.js → Deploy Token (trading is disabled by default)
2. Manually add LP via Uniswap UI (safe since trading is still disabled)
3. node cli.js → Snipe Token → This enables trading and sends buys
4. node cli.js → Manage Token → Lower taxes, renounce ownership, etc.
```

✅ All safe since trading is disabled until you explicitly call `enableTrading()`.

---

## 🧠 Notes

- **Uniswap V2** is used (not V3)  
- LP is created **manually via UI** (you can script it later with `addLiquidity.js`)  
- Uses **Flashbots** to prevent front-running when launching  
- Code uses Hardhat's built-in ethers.js  
- Update the token name to your desired name in the contract and CONTRACT_NAME environment variable
---

## 🧪 Developer Commands

| Action | Command |
|--------|---------|
| Compile contracts | `npx hardhat compile` |
| Deploy manually | `npx hardhat run scripts/tokenDeploy.js` |
| Add LP (optional) | `npx hardhat run scripts/addLiquidity.js` |
| Snipe + enable trading | `npx hardhat run scripts/snipe.js` |
| Query token state | `node cli.js → Query / Modify Token` |

---

## ✅ Supported Token Actions (via Query CLI)

- Renounce ownership  
- Remove limits  
- Enable trading  
- Check if trading is active  
- Lower taxes to 0%  
- Get LP address  
- Get token name & symbol  

## 🧾 MyToken.sol Overview

`MyToken.sol` is the core smart contract of this project. It implements an **ERC-20 token with built-in tax mechanisms** designed for Uniswap V2. The contract includes a number of configurable parameters that help manage trading behavior, tokenomics, and launch protection.

### ⚙️ Key State Variables

- **`maxTx`**: Sets the maximum amount of tokens that can be transferred in a single transaction. Helps reduce volatility and protect against large market dumps.

- **`maxWallet`**: Defines the maximum number of tokens a wallet can hold. This discourages whale accumulation and centralization.

- **`buyFee` / `sellFee`**: Define the tax rate on token purchases and sales. These fees can be routed to a treasury or burned, depending on your tokenomics.

- **`feeWallet`**: The address where collected transaction fees are sent.

- **`swapTokensAtAmount`**: When the contract's token balance exceeds this amount, it triggers a swap back to ETH or redistribution logic (e.g., marketing, liquidity).

- **`tradingActive`**: A boolean flag that must be set to `true` to allow public trading. Until this is enabled, only whitelisted addresses can transfer tokens.

- **`swapEnabled`**: Toggles whether the contract is allowed to perform auto-swaps of tokens to ETH (useful for auto-liquidity or funding).

- **`limitsInEffect`**: When enabled, enforces anti-bot and anti-whale protections like max wallet and max transaction size.

- **`automatedMarketMakerPairs`**: A mapping of AMM pair addresses (like the Uniswap LP) used to identify if a transaction involves a DEX.

---

These parameters allow you to control token behavior during launch and trading. The contract structure supports anti-bot measures, controlled rollout, and fee customization — all critical for managing a fair and secure token launch.

---

## 🛑 Disclaimer

This is a boilerplate for **educational and experimental purposes**.  
Use it at your own risk. Always test with testnets before real deployments.

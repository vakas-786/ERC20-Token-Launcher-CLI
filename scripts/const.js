require('dotenv').config();

module.exports.CONTRACT_NAME = process.env.CONTRACT_NAME;
module.exports.CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

module.exports.RPC_URL = process.env.RPC_URL;
module.exports.CHAIN_ID = Number(process.env.CHAIN_ID);
module.exports.FB_RPC_URL = process.env.FB_RPC_URL;

module.exports.UNISWAPV2ROUTER02 = process.env.UNISWAPV2ROUTER02;

module.exports.ROUTER_ABI = [
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
];

module.exports.WETH_ADDRESS = process.env.WETH_ADDRESS;

module.exports.SNIPER_WALLETS = process.env.SNIPER_WALLETS
    ? process.env.SNIPER_WALLETS.split(',')
    : [];

module.exports.ESTIMATED_ETH_IN_LP = parseFloat(process.env.ESTIMATED_ETH_IN_LP || '0');
module.exports.ESTIMATED_TOKENS_IN_LP = parseFloat(process.env.ESTIMATED_TOKENS_IN_LP || '0');
module.exports.BUY_PCT = parseFloat(process.env.BUY_PCT || '0');
module.exports.BUY_FEE_AMOUNT = parseFloat(process.env.BUY_FEE_AMOUNT || '0');

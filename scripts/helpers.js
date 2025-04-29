require("dotenv").config();
const { ethers } = require("hardhat");

const { 
    UNISWAPV2ROUTER02, 
    CONTRACT_NAME, 
    CONTRACT_ADDRESS,
    ROUTER_ABI,
    RPC_URL,
    CHAIN_ID,
    WETH_ADDRESS
} = require("./const.js");


const MAX_FEE_PER_GAS = "110";
const MAX_PRIORITY_FEE_PER_GAS = "5";
const SWAP_GAS_AMOUNT = 250000;
const DEPLOYER_TX_AMOUNT = 50000;

/*

    Gets a signed transaction for a swap using UniV2s swapExactETHForTokens

*/
async function getSignedSwap(
    provider,
    walletSigner,
    buyAmount
    ) {

    // initialise router with abi
    const router = new ethers.Contract(
        UNISWAPV2ROUTER02, 
        ROUTER_ABI, 
        provider
    );
    const token = await ethers.getContractAt(CONTRACT_NAME, CONTRACT_ADDRESS);

    // call swapExactETHForTokens
    const tx = await router.populateTransaction.swapExactETHForTokens(
        0, 
        [ 
            WETH_ADDRESS,
            token.address 
        ], 
        walletSigner.address, 
        Date.now() + 1000 * 60 * 10);
      
    tx.from = walletSigner.address;
    tx.to = UNISWAPV2ROUTER02;
    tx.value = ethers.utils.parseEther(buyAmount.toString()).toString();
    tx.type = 2;
    tx.maxPriorityFeePerGas = ethers.utils.parseUnits(MAX_PRIORITY_FEE_PER_GAS, "gwei"),
    tx.maxFeePerGas = ethers.utils.parseUnits(MAX_FEE_PER_GAS, "gwei"),
    tx.nonce = (await walletSigner.getTransactionCount())
    tx.gasLimit = SWAP_GAS_AMOUNT;
    tx.chainId = CHAIN_ID;
    
    return await walletSigner.signTransaction(tx);
}


/*

    Array of ETH to use to swap for a certain allo
    NOTE: there are some small calculation logic errors (no major impact)

*/
function calculateETHForSwaps(initialEth, initialTokens, swapPercentage, numberOfSwaps) {
    let ethReserve = initialEth;
    let tokenReserve = initialTokens;
    let swapAmounts = [];

    for (let i = 0; i < numberOfSwaps; i++) {
        let targetTokenAmount = (initialTokens * swapPercentage) / 100;
        let ethRequired = ethReserve * (1 - ((tokenReserve - targetTokenAmount) / tokenReserve));

        ethRequired = parseFloat(ethRequired.toFixed(6));
        ethReserve += ethRequired;
        tokenReserve -= targetTokenAmount;

        console.log(`Swap ${i + 1}: ${ethRequired} ETH required to receive ${targetTokenAmount} tokens`);
        swapAmounts.push(ethRequired);
    }

    return swapAmounts;
}


/*

    Gets a signed transaction for enabling trading

*/
async function getTradingEnabledSignedTx(token, walletSigner) {
    console.log(`Nonce: ${await walletSigner.getTransactionCount()}`);

    const tx = await token.populateTransaction.enableTrading();
    tx.from = walletSigner.address;
    tx.to = token.address;
    tx.value = 0;
    tx.type = 2;
    tx.maxPriorityFeePerGas = ethers.utils.parseUnits(MAX_PRIORITY_FEE_PER_GAS, "gwei"),
    tx.maxFeePerGas = ethers.utils.parseUnits(MAX_FEE_PER_GAS, "gwei"),
    tx.gasLimit = DEPLOYER_TX_AMOUNT;
    tx.chainId = CHAIN_ID;
    tx.nonce = (await walletSigner.getTransactionCount());

    console.log(tx);

    return await walletSigner.signTransaction(tx);
}


/*

    Gets a signed transaction for updating fees
*/
async function getFeesSignedTx(token, walletSigner, buyFeeAmount) {
    console.log(`Nonce: ${await walletSigner.getTransactionCount()}`);

    const tx = await token.populateTransaction.updateBuyFees(
        buyFeeAmount);
    tx.from = walletSigner.address;
    tx.to = token.address;
    tx.value = 0;
    tx.type = 2;
    tx.maxPriorityFeePerGas = ethers.utils.parseUnits(MAX_PRIORITY_FEE_PER_GAS, "gwei"),
    tx.maxFeePerGas = ethers.utils.parseUnits(MAX_FEE_PER_GAS, "gwei"),
    tx.gasLimit = DEPLOYER_TX_AMOUNT;
    tx.chainId = CHAIN_ID;
    tx.nonce = (await walletSigner.getTransactionCount()) + 1;
    return await walletSigner.signTransaction(tx);
}




module.exports = {
    getSignedSwap,
    calculateETHForSwaps,
    getTradingEnabledSignedTx,
    getFeesSignedTx,
};

require("dotenv").config();
const { CONTRACT_ADDRESS, CONTRACT_NAME } = require("./const.js");

async function getContract() {
    const { ethers } = require("hardhat");
    return await ethers.getContractAt(CONTRACT_NAME, CONTRACT_ADDRESS);
}

async function renounceOwnership() {
    const contract = await getContract();
    const tx = await contract.renounceOwnership();
    await tx.wait();
    console.log("✅ Ownership renounced");
}

async function removeLimits() {
    const contract = await getContract();
    const tx = await contract.removeLimits();
    await tx.wait();
    console.log("✅ Limits removed");
}

async function enableTrading() {
    const contract = await getContract();
    const tx = await contract.enableTrading();
    await tx.wait();
    console.log("✅ Trading enabled");
}

async function checkTradingActive() {
    const contract = await getContract();
    const active = await contract.tradingActive();
    console.log(`🔎 Trading active: ${active}`);
}

async function getBalance(address) {
    const contract = await getContract();
    const balance = await contract.balanceOf(address);
    console.log(`💰 Balance of ${address}: ${balance.toString()}`);
}

async function getLP() {
    const contract = await getContract();
    const lp = await contract.uniswapV2Pair();
    console.log(`🔎 LP Address: ${lp}`);
}

async function getNameSymbol() {
    const contract = await getContract();
    const name = await contract.name();
    const symbol = await contract.symbol();
    console.log(`🔎 Token Name: ${name}`);
    console.log(`🔎 Token Symbol: ${symbol}`);
}

async function lowerTaxes() {
    const contract = await getContract();
    const tx1 = await contract.updateSellFees(0);
    const tx2 = await contract.updateBuyFees(0);
    await tx1.wait();
    await tx2.wait();
    console.log("✅ Taxes lowered to 0%");
}

module.exports = {
    renounceOwnership,
    removeLimits,
    enableTrading,
    checkTradingActive,
    getBalance,
    getLP,
    getNameSymbol,
    lowerTaxes
};

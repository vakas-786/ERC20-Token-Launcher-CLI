require("dotenv").config();
const { ethers } = require("hardhat");
const { CONTRACT_NAME } = require("./const.js");


const contractName = CONTRACT_NAME;

async function main() {
    // Compile your contracts
    await hre.run('compile');

    // Print my address
    const accounts = await ethers.getSigners();
    console.log("Deploying contract from account:", accounts[0].address);

    // Get the ContractFactory for your contract
    const MyContract = await ethers.getContractFactory(contractName);

    // Deploy the contract without sending a transaction
    const deploymentTx = MyContract.getDeployTransaction();

    // Estimate the gas required to deploy the contract
    const estimateGas = await ethers.provider.estimateGas(deploymentTx);
    console.log("Estimated gas cost to deploy:", ethers.utils.formatEther(estimateGas.toString()), "ETH");

    // sleep 5s
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const deployedContract = await MyContract.deploy();

    try {
        await deployedContract.deployed();
        console.log("Contract deployed to:", deployedContract.address);
    } catch {
        // sleep 60s
        console.log("Sleeping for 60s");
        await new Promise(resolve => setTimeout(resolve, 60000));
        // log address
        console.log("Contract deployed to:", deployedContract.address);   
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

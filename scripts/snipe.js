require("dotenv").config();
const { ethers } = require("hardhat");
const {
    FlashbotsBundleProvider,
} = require("@flashbots/ethers-provider-bundle");

const {
    getTradingEnabledSignedTx,
    getFeesSignedTx,
    getSignedSwap,
    calculateETHForSwaps,
} = require("./helpers.js");

const { 
    CONTRACT_NAME, 
    CONTRACT_ADDRESS,
    RPC_URL,
    CHAIN_ID,
    FB_RPC_URL,
    SNIPER_WALLETS,
    ESTIMATED_ETH_IN_LP, 
    ESTIMATED_TOKENS_IN_LP, 
    BUY_PCT,
    BUY_FEE_AMOUNT
} = require("./const.js");


const provider = new ethers.providers.JsonRpcProvider({url: RPC_URL});
const walletSigner = new ethers.Wallet("0x" + process.env.PRIVATE_KEY, provider);
const authSigner = new ethers.Wallet("0x" + process.env.FB_AUTH, provider);


async function main() {
    const token = await ethers.getContractAt(CONTRACT_NAME, CONTRACT_ADDRESS);

    const flashbotsProvider = await FlashbotsBundleProvider.create(
        provider,
        authSigner,
        FB_RPC_URL,
        CHAIN_ID
    );

    // Deployer txs
    const tradingEnabledSignedTx = await getTradingEnabledSignedTx(
        token,
        walletSigner
        );
    const feesSignedTx = await getFeesSignedTx(
        token,
        walletSigner,
        BUY_FEE_AMOUNT
        );

    let signedTransactions = [
        {signedTransaction: tradingEnabledSignedTx},
    ];

    // Sniping txs
    const swapAmountArray = calculateETHForSwaps(
        ESTIMATED_ETH_IN_LP, 
        ESTIMATED_TOKENS_IN_LP, 
        BUY_PCT, 
        SNIPER_WALLETS.length);

    for (let i = 0; i < SNIPER_WALLETS.length; i++) {
        console.log(
            `Sniping with ${swapAmountArray[i]} ETH`,
            `On wallet ${i + 1} of ${SNIPER_WALLETS.length} wallets`,
            `Address: ${new ethers.Wallet("0x" + SNIPER_WALLETS[i], provider).address}`
        )
        const signedSwap = await getSignedSwap(
            provider, 
            new ethers.Wallet("0x" + SNIPER_WALLETS[i], provider), 
            swapAmountArray[i]);
        signedTransactions.push({signedTransaction: signedSwap});
    }

    signedTransactions.push({signedTransaction: feesSignedTx});

    const signedBundle = await flashbotsProvider.signBundle(signedTransactions);

    const STARTING_BLOCK_NUMBER = (await provider.getBlockNumber()) + 2;
    const BLOCKS_TO_SEND = 10;
    const simulation = await flashbotsProvider.simulate(signedBundle, STARTING_BLOCK_NUMBER);
    console.log(JSON.stringify(simulation, null, 2));

    for (let i = 0; i < BLOCKS_TO_SEND; i++) {
        const targetBlockNumber = STARTING_BLOCK_NUMBER + i;
        console.log(`Sending bundles to block ${targetBlockNumber}`);
        for (let j = 0; j < 20; j++) {
            const response = await flashbotsProvider.sendRawBundle(signedBundle, targetBlockNumber + i);
            // sleep 30ms
            await new Promise((resolve) => setTimeout(resolve, 30));
            console.log('Flashbots bundle response: ', response);
        }
    }
    
    
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

    
require('dotenv').config();
const inquirer = require('inquirer');
const { exec } = require('child_process');
const path = require('path');

const queries = require('./scripts/token-queries.js');

async function main() {
    console.clear();
    console.log(`Welcome to the Token Launcher CLI 🚀`);

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
                { name: '🔫 Snipe a Token', value: 'snipe' },
                { name: '🛠️ Deploy a Token Contract', value: 'deploy' },
                { name: '🔎 Manage / Modify Token (lower tax, enable trading, renounce ownership, and etc.)', value: 'manage' },
                { name: '❌ Exit', value: 'exit' }
            ]
        }
    ]);

    switch (action) {
        case 'snipe':
            console.log("\nStarting sniper...\n");
            execScript('snipe.js');
            break;
        case 'deploy':
            console.log("\nStarting token deploy...\n");
            execScript('tokenDeploy.js');
            break;
        case 'manage':
            console.log("\nRunning token queries...\n");
            await runQueries();
            break;
        case 'exit':
            console.log("\nGoodbye!");
            process.exit(0);
    }
}

function execScript(scriptName) {
    const scriptPath = path.join(__dirname, 'scripts', scriptName);
    const processRun = exec(`node "${scriptPath}"`);

    processRun.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    processRun.stderr.on('data', (data) => {
        console.error(data.toString());
    });

    processRun.on('exit', (code) => {
        console.log(`\nProcess exited with code ${code}`);
        process.exit(code);
    });
}

async function runQueries() {
    const { queryAction } = await inquirer.prompt([
        {
            type: 'list',
            name: 'queryAction',
            message: 'Which token query action do you want to perform?',
            choices: [
                { name: 'Renounce Ownership', value: 'renounceOwnership' },
                { name: 'Remove Limits', value: 'removeLimits' },
                { name: 'Open Trading', value: 'enableTrading' },
                { name: 'Check if Trading is Active', value: 'checkTradingActive' },
                { name: 'Get LP Address', value: 'getLP' },
                { name: 'Get Token Name and Symbol', value: 'getNameSymbol' },
                { name: 'Lower Taxes to 0%', value: 'lowerTaxes' },
                { name: 'Back to Main Menu', value: 'back' }
            ]
        }
    ]);

    if (queryAction === 'back') {
        return main();
    }

    try {
        await queries[queryAction]();
    } catch (error) {
        console.error(`❌ Error performing job: ${error.message}`);
    }

    console.log("\n✅ Job completed.");
    await runQueries();
}

main();

// // FILE -> Writing/DefiningDeployingScripts

// const {ethers, run, network} = require("hardhat");

// async function main() {
//   console.log("- - - - - - - - - - - - - - - - - - - - -");
//   console.log("- - - - - - - - - - - - - - - - - - - - -");
//   console.log(`Contract deployment ⌛`);
//   console.log("- - - - - - - - - - - - - - - - - - - - -");

//   const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
//   const simpleStorage = await SimpleStorageFactory.deploy();
//   await simpleStorage.deployed();

//   console.log("Contract deployed successfully \u2705");
//   console.log(`Contract address : ${simpleStorage.address}`);
//   console.log(`Deployment chainID: [ ${network.config.chainId} ]`);

//   if (network.config.chainId === 11155111) {
//     console.log(`Deployment network: Sepolia Testnet`);
//     console.log("Waiting for block confirmations ... \u23F3");
//     await simpleStorage.deployTransaction.wait(6);
//     await verify(simpleStorage.address, []);
//   } else if (network.config.chainId === 31337) {
//     console.log(`Deployment network: Localhost [ Hardhat ]`);
//   } else if (network.config.chainId === 80002) {
//     console.log(`Deployment network: Polygon Amoy Testnet`);
//     console.log("Waiting for block confirmations ... \u23F3");
//     await simpleStorage.deployTransaction.wait(3);
//     console.log("3 block confirmations done \u2705");
//   } else if (network.config.chainId === 2710) {
//     console.log(`Deployment network: Morph Testnet`);
//     console.log("Waiting for block confirmations ... \u23F3");
//     await simpleStorage.deployTransaction.wait(2);
//     console.log("2 block confirmations done \u2705");
//     await verify(simpleStorage.address, []);
//   }

//   console.log("- - - - - - - - - - - - - - - - - - - - -");
//   console.log(`Contract interactions ⌛`);
//   console.log("- - - - - - - - - - - - - - - - - - - - -");

//   // contractInteraction
//   const currentValue = await simpleStorage.retrieve();
//   console.log(`Current value : ${currentValue}`);
//   console.log("Updating value to 7");
//   const transactionResponse = await simpleStorage.store(7);
//   await transactionResponse.wait(1);
//   const updatedValue = await simpleStorage.retrieve();
//   console.log(`Updated value : ${updatedValue}`);

//   console.log("- - - - - - - - - - - - - - - - - - - - -");
//   console.log("- - - - - - - - - - - - - - - - - - - - -");
// }

// const verify = async (contractAddress, args) => {
//   console.log("Verifying contract on Etherscan \u23F3");
//   try {
//     await run("verify:verify", {
//       address: contractAddress,
//       constructorArguments: args,
//     });
//   } catch (e) {
//     if (e.message.toLowerCase().includes("already verified")) {
//       console.log("Already Verified!");
//     } else {
//       console.log(e);
//     }
//   }
// };

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

// // run > npx hardhat run scripts/deploy.js --network <network-name>
// // run > npx hardhat run scripts/deploy.js --network localhost
// // run > npx hardhat run scripts/deploy.js --network morph

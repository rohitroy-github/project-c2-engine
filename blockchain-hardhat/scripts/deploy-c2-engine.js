const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const initialBalance = await deployer.getBalance();

  console.log("Contract deployer: ", deployer.address);
  console.log("Deployer account balance: ", initialBalance.toString());

  // Deploy GameToken
  const Token = await hre.ethers.getContractFactory("GameToken");
  const token = await Token.deploy();
  await token.deployed();

  // Deploy GameNFT
  const NFT = await hre.ethers.getContractFactory("GameNFT");
  const nft = await NFT.deploy();
  await nft.deployed();

  // Set initial metadata URIs here BEFORE ownership transfer (optional)
  await nft.setLevelMetadataURI(0, "http://localhost:3000/level_0.json"); // beginner-nft
  await nft.setLevelMetadataURI(1, "http://localhost:3000/level_1.json"); // winner-nft
  await nft.setLevelMetadataURI(2, "http://localhost:3000/level_2.json"); // 10-wins-nft

  // Deploy GameEngine with token and NFT addresses
  const Engine = await hre.ethers.getContractFactory("GameEngine");
  const engine = await Engine.deploy(token.address, nft.address);
  await engine.deployed();

  // Transfer ownership of token and NFT to GameEngine contract
  await token.transferOwnership(engine.address);
  await nft.transferOwnership(engine.address);

  // ✅ Now GameEngine is owner of GameToken, so it can mint
  // const initialSupply = hre.ethers.utils.parseUnits("1000", 18);
  // await engine.connect(deployer).mint(engine.address, initialSupply);

  const finalBalance = await deployer.getBalance();
  const deploymentCost = initialBalance.sub(finalBalance);

  console.log("Contracts Deployed Successfully 🚀");
  console.log("✅ GameToken deployed: ", token.address);
  console.log("✅ GameNFT deployed: ", nft.address);
  console.log("✅ GameEngine deployed: ", engine.address);
  console.log("✅ Ownership of Token & NFT transferred to GameEngine");
  console.log("✅ GameEngine minted 1000 tokens to itself");

  console.log(
    "Total deployment costing (In ETH): ",
    hre.ethers.utils.formatEther(deploymentCost),
    "ETH"
  );
}

main().catch((error) => {
  console.error("❌ Error in contract deployment:", error);
  process.exit(1);
});

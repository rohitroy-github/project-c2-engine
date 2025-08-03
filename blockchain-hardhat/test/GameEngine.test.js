const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameEngine", () => {
  let token, nft, engine, owner, player1, player2, player3, other;

  const ENTRY_FEE = ethers.utils.parseEther("25");
  const INITIAL_MINT = ethers.utils.parseEther("75");
  const ETH_TO_TOKEN_RATE = 5000;

  beforeEach(async () => {
    [owner, player1, player2, player3, other] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("GameToken");
    token = await Token.deploy();
    await token.deployed();

    const NFT = await ethers.getContractFactory("GameNFT");
    nft = await NFT.deploy();
    await nft.deployed();

    await nft.setLevelMetadataURI(1, "ipfs://beginner.json");
    await nft.setLevelMetadataURI(2, "ipfs://intermediate.json");
    await nft.setLevelMetadataURI(3, "ipfs://pro.json");

    const Engine = await ethers.getContractFactory("GameEngine");
    engine = await Engine.deploy(token.address, nft.address);
    await engine.deployed();

    // Transfer ownership of token and nft contracts to GameEngine
    await token.transferOwnership(engine.address);
    await nft.transferOwnership(engine.address);

    // Register 3 players and enter tournament
    // await engine.connect(player1).registerUser();
    // await engine.connect(player2).registerUser();
    // await engine.connect(player3).registerUser();

    // await token.connect(player1).approve(engine.address, ENTRY_FEE);
    // await token.connect(player2).approve(engine.address, ENTRY_FEE);
    // await token.connect(player3).approve(engine.address, ENTRY_FEE);

    // await engine.connect(player1).enterTournament();
    // await engine.connect(player2).enterTournament();
    // await engine.connect(player3).enterTournament();
  });

  describe("User registration", () => {
    it("registers user and mints 75 tokens", async () => {
      await expect(engine.connect(player1).registerUser())
        .to.emit(engine, "RegistrationBalanceTransferred")
        .withArgs(player1.address);

      const balance = await token.balanceOf(player1.address);
      expect(balance).to.equal(INITIAL_MINT);
    });

    it("allows multiple users to register", async () => {
      await engine.connect(player1).registerUser();
      await engine.connect(player2).registerUser();

      expect(await token.balanceOf(player1.address)).to.equal(INITIAL_MINT);
      expect(await token.balanceOf(player2.address)).to.equal(INITIAL_MINT);
    });
  });

  describe("Tournament entry", () => {
    beforeEach(async () => {
      await engine.connect(player1).registerUser();
      await token.connect(player1).approve(engine.address, ENTRY_FEE);
    });

    it("allows user to enter tournament and deducts tokens", async () => {
      await expect(engine.connect(player1).enterTournament())
        .to.emit(engine, "TournamentFeeDeducted")
        .withArgs(player1.address);

      const balance = await token.balanceOf(player1.address);
      expect(balance).to.equal(INITIAL_MINT.sub(ENTRY_FEE));

      const currentTournamentFeePool = await engine.currentTournamentFeePool();
      expect(currentTournamentFeePool).to.equal(ENTRY_FEE);
    });

    it("reverts if user has insufficient tokens", async () => {
      await expect(
        engine.connect(player2).enterTournament()
      ).to.be.revertedWith("Not enough tokens");
    });
  });

  describe("Reward distribution", () => {
    beforeEach(async () => {
      // Register and enter tournament with 3 players
      for (const p of [player1, player2, player3]) {
        await engine.connect(p).registerUser();
        await token.connect(p).approve(engine.address, ENTRY_FEE);
        await engine.connect(p).enterTournament();
      }
    });

    it("only owner can distribute rewards", async () => {
      await expect(
        engine
          .connect(player1)
          .distributeRewards(
            1,
            player1.address,
            player2.address,
            player3.address
          )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("distributes correct rewards and mints NFT to first place", async () => {
      const currentTournamentFeePool = await engine.currentTournamentFeePool();
      expect(currentTournamentFeePool).to.equal(ENTRY_FEE.mul(3));

      await expect(
        engine
          .connect(owner)
          .distributeRewards(
            1,
            player1.address,
            player2.address,
            player3.address
          )
      )
        .to.emit(engine, "TournamentRewardsDistributed")
        .withArgs(
          1,
          player1.address,
          player2.address,
          player3.address,
          currentTournamentFeePool.mul(30).div(100),
          ENTRY_FEE.mul(75).div(100),
          ENTRY_FEE.mul(25).div(100)
        );

      // Check token balances after rewards
      expect(await token.balanceOf(player1.address)).to.equal(
        currentTournamentFeePool
          .mul(30)
          .div(100)
          .add(ethers.utils.parseUnits("50", 18))
      );

      expect(await token.balanceOf(player2.address)).to.equal(
        ENTRY_FEE.mul(75).div(100).add(ethers.utils.parseUnits("50", 18))
      );
      expect(await token.balanceOf(player3.address)).to.equal(
        ENTRY_FEE.mul(25).div(100).add(ethers.utils.parseUnits("50", 18))
      );

      // Check NFT minted to first place
      expect(await nft.ownerOf(0)).to.equal(player1.address);

      // Pool should be reset
      expect(await engine.currentTournamentFeePool()).to.equal(0);
    });

    it("resets currentTournamentFeePool to zero after distributing rewards", async () => {
      // Distribute rewards
      await engine
        .connect(owner)
        .distributeRewards(
          1,
          player1.address,
          player2.address,
          player3.address
        );

      // Assert currentTournamentFeePool is zero
      expect(await engine.currentTournamentFeePool()).to.equal(0);
    });

    it("reverts if pool is empty", async () => {
      // Reset pool manually for test
      await engine
        .connect(owner)
        .distributeRewards(
          1,
          player1.address,
          player2.address,
          player3.address
        );
      await expect(
        engine
          .connect(owner)
          .distributeRewards(
            2,
            player1.address,
            player2.address,
            player3.address
          )
      ).to.be.revertedWith("No tournament pool available");
    });
  });

  describe("Token purchase", () => {
    it("allows token purchase via ETH", async () => {
      const purchaseAmount = ethers.utils.parseEther("0.1");

      await expect(engine.connect(player1).buyTokens({ value: purchaseAmount }))
        .to.emit(engine, "TokensPurchased")
        .withArgs(
          player1.address,
          purchaseAmount,
          purchaseAmount.mul(ETH_TO_TOKEN_RATE)
        );

      const balance = await token.balanceOf(player1.address);
      expect(balance).to.equal(purchaseAmount.mul(ETH_TO_TOKEN_RATE));
    });

    it("reverts if zero ETH sent", async () => {
      await expect(
        engine.connect(player1).buyTokens({ value: 0 })
      ).to.be.revertedWith("Send ETH to buy tokens");
    });
  });

  describe("Withdraw ETH", () => {
    it("allows owner to withdraw ETH", async () => {
      const provider = ethers.provider;

      const purchaseAmount = ethers.utils.parseEther("0.1");
      await engine.connect(player1).buyTokens({ value: purchaseAmount });

      const beforeBalance = await provider.getBalance(owner.address);

      const tx = await engine.connect(owner).withdraw();
      const receipt = await tx.wait();

      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);

      const afterBalance = await provider.getBalance(owner.address);
      const contractBalance = await provider.getBalance(engine.address);

      expect(contractBalance).to.equal(0);
      expect(afterBalance).to.equal(
        beforeBalance.add(purchaseAmount).sub(gasUsed)
      );
    });

    it("prevents non-owner from withdrawing", async () => {
      await expect(engine.connect(player1).withdraw()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});

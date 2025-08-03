const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameNFT - CLASHNFT", function () {
  let GameNFT, gameNFT, owner, otherUser;

  beforeEach(async () => {
    [owner, otherUser] = await ethers.getSigners();
    GameNFT = await ethers.getContractFactory("GameNFT");
    gameNFT = await GameNFT.deploy();
    await gameNFT.deployed();
  });

  describe("Deployment", function () {
    it("should deploy with correct name and symbol", async () => {
      expect(await gameNFT.name()).to.equal("Clash NFT");
      expect(await gameNFT.symbol()).to.equal("CLASHNFT");
    });
  });

  describe("Setting metadata", function () {
    it("should allow owner to set metadata URI for a level", async () => {
      await gameNFT.setLevelMetadataURI(1, "ipfs://beginner.json");
      expect(await gameNFT.levelMetadataURIs(1)).to.equal(
        "ipfs://beginner.json"
      );
    });

    it("should fail if non-owner tries to set metadata", async () => {
      await expect(
        gameNFT
          .connect(otherUser)
          .setLevelMetadataURI(2, "ipfs://intermediate.json")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Minting NFT", function () {
    it("should mint an NFT with correct level and URI", async () => {
      await gameNFT.setLevelMetadataURI(1, "ipfs://beginner.json");

      await expect(gameNFT.mintWithLevel(otherUser.address, 1))
        .to.emit(gameNFT, "NFTMinted")
        .withArgs(otherUser.address, 0, 1);

      expect(await gameNFT.tokenLevel(0)).to.equal(1);
      expect(await gameNFT.tokenURI(0)).to.equal("ipfs://beginner.json");
      expect(await gameNFT.ownerOf(0)).to.equal(otherUser.address);
    });

    it("should fail to mint NFT for unset metadata level", async () => {
      await expect(
        gameNFT.mintWithLevel(otherUser.address, 3)
      ).to.be.revertedWith("Metadata not set for level");
    });

    it("should allow minting multiple NFTs with different levels and URIs", async () => {
      await gameNFT.setLevelMetadataURI(1, "ipfs://beginner.json");
      await gameNFT.setLevelMetadataURI(2, "ipfs://pro.json");

      await gameNFT.mintWithLevel(otherUser.address, 1);
      await gameNFT.mintWithLevel(owner.address, 2);

      expect(await gameNFT.tokenURI(0)).to.equal("ipfs://beginner.json");
      expect(await gameNFT.tokenURI(1)).to.equal("ipfs://pro.json");

      expect(await gameNFT.tokenLevel(0)).to.equal(1);
      expect(await gameNFT.tokenLevel(1)).to.equal(2);
    });
  });

  describe("Metadata & views", function () {
    it("should return correct token URI and level", async () => {
      await gameNFT.setLevelMetadataURI(2, "ipfs://pro.json");
      await gameNFT.mintWithLevel(otherUser.address, 2);

      expect(await gameNFT.tokenURI(0)).to.equal("ipfs://pro.json");
      expect(await gameNFT.tokenLevel(0)).to.equal(2);
    });

    it("should revert tokenURI query for non-existent token", async () => {
      await expect(gameNFT.tokenURI(999)).to.be.revertedWith(
        "ERC721Metadata: URI query for nonexistent token"
      );
    });

    it("should revert tokenLevel query for non-existent token", async () => {
      await expect(gameNFT.tokenLevel(999)).to.be.revertedWith(
        "Token does not exist"
      );
    });
  });

  describe("Soulbound logics", function () {
    beforeEach(async () => {
      await gameNFT.setLevelMetadataURI(1, "ipfs://beginner.json");
      await gameNFT.mintWithLevel(otherUser.address, 1);
    });

    it("should not allow transferring the NFT", async () => {
      await expect(
        gameNFT
          .connect(otherUser)
          .transferFrom(otherUser.address, owner.address, 0)
      ).to.be.revertedWith("Soulbound: Transfers not allowed");
    });

    it("should not allow approvals", async () => {
      await expect(
        gameNFT.connect(otherUser).approve(owner.address, 0)
      ).to.be.revertedWith("Soulbound: Approvals disabled");

      await expect(
        gameNFT.connect(otherUser).setApprovalForAll(owner.address, true)
      ).to.be.revertedWith("Soulbound: Approvals disabled");
    });
  });
});

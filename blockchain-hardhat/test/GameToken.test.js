const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GameToken - CLASH", function () {
  let GameToken, gameToken, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    GameToken = await ethers.getContractFactory("GameToken");
    gameToken = await GameToken.deploy();
    await gameToken.deployed();
  });

  describe("Deployment", function () {
    it("should deploy with correct name and symbol", async function () {
      expect(await gameToken.name()).to.equal("Clash Token");
      expect(await gameToken.symbol()).to.equal("CLASH");
    });
  });

  describe("Minting tokens", function () {
    it("should allow only owner to mint tokens", async function () {
      const amount = ethers.utils.parseEther("50");

      // Non-owner cannot mint
      await expect(
        gameToken.connect(addr1).mint(addr1.address, amount)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      // Owner can mint and event emitted
      await expect(gameToken.connect(owner).mint(addr1.address, amount))
        .to.emit(gameToken, "TokensMinted")
        .withArgs(addr1.address, amount);

      expect(await gameToken.balanceOf(addr1.address)).to.equal(amount);
    });
  });

  describe("Pausing logics", function () {
    it("should allow only owner to pause and unpause", async function () {
      await expect(gameToken.connect(addr1).pause()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
      await expect(gameToken.connect(addr1).unpause()).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );

      await gameToken.connect(owner).pause();
      expect(await gameToken.paused()).to.equal(true);

      await gameToken.connect(owner).unpause();
      expect(await gameToken.paused()).to.equal(false);
    });

    it("should block transfers when paused", async function () {
      const amount = ethers.utils.parseEther("10");
      await gameToken.connect(owner).mint(addr1.address, amount);
      await gameToken.connect(owner).pause();

      await expect(
        gameToken
          .connect(addr1)
          .transfer(addr2.address, ethers.utils.parseEther("5"))
      ).to.be.revertedWith("Pausable: paused");
    });

    it("should allow transfers when unpaused", async function () {
      const amount = ethers.utils.parseEther("10");
      await gameToken.connect(owner).mint(addr1.address, amount);
      await gameToken.connect(owner).pause();
      await gameToken.connect(owner).unpause();

      await gameToken
        .connect(addr1)
        .transfer(addr2.address, ethers.utils.parseEther("5"));
      const finalBalance = await gameToken.balanceOf(addr2.address);
      expect(finalBalance).to.equal(ethers.utils.parseEther("5"));
    });

        it("should allow token transfers when not paused", async function () {
      const amount = ethers.utils.parseEther("20");
      await gameToken.connect(owner).mint(addr1.address, amount);

      await expect(
        gameToken
          .connect(addr1)
          .transfer(addr2.address, ethers.utils.parseEther("10"))
      ).to.not.be.reverted;

      const addr2Balance = await gameToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.utils.parseEther("10"));
    });

    it("should not allow transfers exceeding balance", async function () {
      const amount = ethers.utils.parseEther("5");
      await gameToken.connect(owner).mint(addr1.address, amount);

      await expect(
        gameToken
          .connect(addr1)
          .transfer(addr2.address, ethers.utils.parseEther("10"))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });
});

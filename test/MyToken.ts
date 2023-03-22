import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MyToken Test", function () {
  const MINT_AMOUNT = 10;
  const INITIAL_SUPPLY = 100;

  async function deployMyTokenFixture() {
    const [dev, alice] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();

    return { dev, alice, myToken };
  }

  async function mintAliceFixture() {
    const { dev, alice, myToken } = await loadFixture(deployMyTokenFixture);
    await myToken.connect(alice).mint();

    return { dev, alice, myToken };
  }

  describe("Deployment", function () {
    it("should have the correct name and symbol", async function () {
      const { myToken } = await loadFixture(deployMyTokenFixture);

      expect(await myToken.name()).to.equal("MyToken");
      expect(await myToken.symbol()).to.equal("MYT");
    });

    it("should have the correct owner after deployment", async function () {
      const { myToken, dev } = await loadFixture(deployMyTokenFixture);

      expect(await myToken.owner()).to.equal(dev.address);
    });

    it("should be able to mint the initial supply to owner", async function () {
      const { myToken, dev } = await loadFixture(deployMyTokenFixture);

      expect(await myToken.balanceOf(dev.address)).to.equal(INITIAL_SUPPLY);
    });
  });

  describe("Mint & Burn", function () {
    it("should be able to mint a token", async function () {
      const { myToken, alice } = await loadFixture(deployMyTokenFixture);

      await expect(myToken.connect(alice).mint())
        .to.emit(myToken, "Mint")
        .withArgs(alice.address, MINT_AMOUNT)
        .to.emit(myToken, "Transfer")
        .withArgs(ethers.constants.AddressZero, alice.address, MINT_AMOUNT);

      expect(await myToken.alreadyMinted(alice.address)).to.equal(true);
      expect(await myToken.balanceOf(alice.address)).to.equal(MINT_AMOUNT);
      expect(await myToken.totalSupply()).to.equal(
        INITIAL_SUPPLY + MINT_AMOUNT
      );
    });

    it("should not be able to mint a token twice", async function () {
      const { myToken, alice } = await loadFixture(deployMyTokenFixture);

      await myToken.connect(alice).mint();
      await expect(myToken.connect(alice).mint()).to.be.revertedWith(
        "Already minted"
      );
    });

    it("should be able to burn a token by the owner", async function () {
      const { myToken, alice } = await loadFixture(deployMyTokenFixture);

      await myToken.connect(alice).mint();
      await expect(myToken.burn(alice.address))
        .to.emit(myToken, "Burn")
        .withArgs(alice.address, 10);

      expect(await myToken.balanceOf(alice.address)).to.equal(0);
      expect(await myToken.alreadyMinted(alice.address)).to.equal(false);
    });

    it("should not be able to burn a token by a non-owner", async function () {
      const { myToken, alice } = await loadFixture(deployMyTokenFixture);

      await myToken.connect(alice).mint();
      await expect(
        myToken.connect(alice).burn(alice.address)
      ).to.be.revertedWith("Only owner");
    });
  });

  describe("Transfer", function () {
    it("should not be able to transfer", async function () {
      const { myToken, dev, alice } = await loadFixture(mintAliceFixture);

      await expect(
        myToken.connect(alice).transfer(dev.address, 10)
      ).to.be.revertedWith("Transfer not allowed");
    });
  });
});

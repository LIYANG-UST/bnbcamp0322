import { ethers } from "hardhat";
import { expect } from "chai";
import { MyPunks, MyPunks__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("MyPunks Test", function () {
  let MyPunksFactory: MyPunks__factory;
  let mypunks: MyPunks;
  let admin: SignerWithAddress,
    alice: SignerWithAddress,
    bob: SignerWithAddress;

  beforeEach(async function () {
    [admin, alice, bob] = await ethers.getSigners();
    // 获得Contract Factory
    MyPunksFactory = await ethers.getContractFactory("MyPunks");
    // 部署Contract
    mypunks = await MyPunksFactory.deploy();
  });

  describe("Deployment", function () {
    it("should have the correct owner", async function () {
      expect(await mypunks.owner()).to.equal(admin.address);
    });

    it("should have the correct intial value", async function () {
      expect(await mypunks.counter()).to.equal(0);
    });
  });

  describe("Mint", function () {
    it("should be able to add a whitelist address", async function () {
      await expect(mypunks.addWhitelist(alice.address))
        .to.emit(mypunks, "NewWhitelistAdded")
        .withArgs(alice.address);

      expect(await mypunks.isWhitelisted(alice.address)).to.equal(true);
    });

    it("should be able to mint a token", async function () {
      // Add whitelist
      await mypunks.addWhitelist(alice.address);
      // Mint NFT by alice
      await expect(mypunks.connect(alice).mint())
        .to.emit(mypunks, "NewPunkMinted")
        .withArgs(alice.address, 1);
      // Result check
      expect(await mypunks.counter()).to.equal(1);
      expect(await mypunks.balanceOf(alice.address)).to.equal(1);
      expect(await mypunks.userTokenId(alice.address)).to.equal(1);
    });

    it("should not be able to mint more than one token", async function () {
      await mypunks.addWhitelist(alice.address);
      await mypunks.connect(alice).mint();
      // Mint NFT by alice again
      await expect(mypunks.connect(alice).mint()).to.be.revertedWith(
        "Already minted"
      );
    });
  });

  describe("Transfer", function () {
    beforeEach(async function () {
      await mypunks.addWhitelist(alice.address);
      await mypunks.connect(alice).mint();
    });

    it("should not be able to transfer mypunks", async function () {
      await expect(
        mypunks.connect(alice).transferFrom(alice.address, bob.address, 1)
      ).to.be.revertedWith("Transfer not allowed");
    });
  });

  describe("Burn", function () {
    beforeEach(async function () {
      await mypunks.addWhitelist(alice.address);
      await mypunks.connect(alice).mint();
    });
    it("should be able to burn nft by owner", async function () {
      await expect(mypunks.burn(alice.address))
        .to.emit(mypunks, "PunkBurned")
        .withArgs(alice.address, 1);
    });
    it("should not be able to burn nft by non-owner", async function () {
      await expect(mypunks.connect(bob).burn(alice.address)).to.be.revertedWith(
        "Not owner"
      );
    });
  });
});

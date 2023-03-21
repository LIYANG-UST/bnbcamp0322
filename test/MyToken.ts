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

  it("should have the correct owner", async function () {
    const { myToken, dev } = await loadFixture(deployMyTokenFixture);

    expect(await myToken.owner()).to.equal(dev.address);
  });

  it("should be able to mint a token", async function () {
    const { myToken, alice } = await loadFixture(deployMyTokenFixture);

    await expect(myToken.connect(alice).mint())
      .to.emit(myToken, "Mint")
      .withArgs(alice.address, MINT_AMOUNT);

    expect(await myToken.alreadyMinted(alice.address)).to.equal(true);
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
});

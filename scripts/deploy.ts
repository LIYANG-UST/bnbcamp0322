import { ethers, network } from "hardhat";
import { storeMyTokenAddress } from "./helper";

async function main() {
  const MyToken = await ethers.getContractFactory("MyToken");
  const myToken = await MyToken.deploy();

  await myToken.deployed();

  console.log(
    "Deployed MyToken on",
    network.name,
    "by",
    myToken.deployTransaction.from
  );
  console.log(`Deployed MyToken to: ${myToken.address}`);
  console.log(`Transaction hash: ${myToken.deployTransaction.hash}`);

  storeMyTokenAddress(network.name, myToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

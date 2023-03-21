import { ethers } from "hardhat";

async function main() {
  const MyPunks = await ethers.getContractFactory("MyPunks");
  const mypunks = await MyPunks.deploy();

  await mypunks.deployed();

  console.log(
    `Deployed MyPunks to: ${mypunks.address} with ${mypunks.deployTransaction.hash}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

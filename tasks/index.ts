import { task, types } from "hardhat/config";
import { getMyTokenAddress, storeMyTokenAddress } from "../scripts/helper";
import { MyToken__factory } from "../typechain-types";

task("deploy", "Deploy MyToken contract").setAction(async (_, hre) => {
  const { network } = hre;
  const [dev] = await hre.ethers.getSigners();

  console.log("Deploying mytoken to ", network.name, " by ", dev.address);

  const myToken = await new MyToken__factory(dev).deploy();

  console.log(`Deployed mytoken to: ${myToken.address}`);

  storeMyTokenAddress(network.name, myToken.address);
});

task("mint", "Mint my token").setAction(async (_, hre) => {
  const { network } = hre;
  const [, alice] = await hre.ethers.getSigners();

  const myToken = new MyToken__factory(alice).attach(
    getMyTokenAddress(network.name)
  );

  const tx = await myToken.mint();
  console.log("Tx details: ", await tx.wait());
});

task("burn", "Burn my token").setAction(async (_, hre) => {
  const { network } = hre;
  const [dev, alice] = await hre.ethers.getSigners();

  const myToken = new MyToken__factory(dev).attach(
    getMyTokenAddress(network.name)
  );

  const tx = await myToken.burn(alice.address);
  console.log("Tx details: ", await tx.wait());
});

task("balance", "Get my token balance")
  .addParam("address", "The address to check", null, types.string)
  .setAction(async (_, hre) => {
    const { network } = hre;
    const [, alice] = await hre.ethers.getSigners();

    const myToken = new MyToken__factory(alice).attach(
      getMyTokenAddress(network.name)
    );

    const balance = await myToken.balanceOf(alice.address);
    console.log("Alice token balance: ", balance.toString());
  });

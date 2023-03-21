import { task } from "hardhat/config";
import { MyPunks__factory } from "../typechain-types";

task("deploy", "Deploy MyPunks contract").setAction(async (_, hre) => {
  const { network } = hre;
  const [dev_account] = await hre.ethers.getSigners();

  console.log(
    "Deploying mypunks contract to network ",
    network.name,
    " by ",
    dev_account.address
  );

  const mypunks = await new MyPunks__factory(dev_account).deploy();

  console.log(
    `Deployed MyPunks to: ${mypunks.address} with ${mypunks.deployTransaction.hash}`
  );
});

task("addWhitelist", "Add a new whitelist address")
  .addParam("address", "The address to be added")
  .setAction(async (taskArgs, hre) => {
    const [dev_account] = await hre.ethers.getSigners();

    console.log("Sending transactions with account: ", dev_account.address);

    const MYPUNKS_ADDRESS = "0xb5Da03002b37860182B95AC4329B69F19eFa8A06";
    const mypunks = new MyPunks__factory(dev_account).attach(MYPUNKS_ADDRESS);

    const tx = await mypunks.addWhitelist(taskArgs.address);
    console.log("Tx details: ", await tx.wait());
  });

task("mint", "Add a new whitelist address").setAction(async (_, hre) => {
  const [, alice] = await hre.ethers.getSigners();

  console.log("Sending transactions with account: ", alice.address);

  const MYPUNKS_ADDRESS = "0xb5Da03002b37860182B95AC4329B69F19eFa8A06";
  const mypunks = new MyPunks__factory(alice).attach(MYPUNKS_ADDRESS);

  const tx = await mypunks.connect(alice).mint();
  console.log("Tx details: ", await tx.wait());
});

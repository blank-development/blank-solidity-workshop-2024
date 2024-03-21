const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🔥 Deploying Blank Hub with the account: ", deployer.address);

  const BlankHub = await ethers.getContractFactory("BlankHub");

  const blankHub = await BlankHub.deploy(
    "0x123" // your ERC20 payment token address
  );

  await blankHub.deployed();

  console.log("🚀 Blank Hub deployed to: ", blankHub.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

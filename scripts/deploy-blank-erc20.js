const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🔥 Deploying Blank ERC20 with the account: ", deployer.address);

  const BlankERC20 = await ethers.getContractFactory("BlankERC20");

  const blankToken = await BlankERC20.deploy();
  await blankToken.deployed();

  console.log("🚀 Blank ERC20 deployed to: ", blankToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

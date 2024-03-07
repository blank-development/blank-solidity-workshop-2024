const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "🔥 Deploying Blank Marketplace with the account: ",
    deployer.address
  );

  const BlankMarketplace = await ethers.getContractFactory("BlankMarketplace");

  const blankMarketplace = await BlankMarketplace.deploy();
  await blankMarketplace.deployed();

  console.log("🚀 Blank Marketplace deployed to: ", blankMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

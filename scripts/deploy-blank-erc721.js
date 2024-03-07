const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🔥 Deploying Blank ERC721 with the account: ", deployer.address);

  const BlankERC721 = await ethers.getContractFactory("BlankERC721");

  const blankERC721 = await BlankERC721.deploy();
  await blankERC721.deployed();

  console.log("🚀 Blank ERC721 deployed to: ", blankERC721.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

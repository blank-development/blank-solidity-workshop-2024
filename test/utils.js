const { ethers } = require("hardhat");

async function deployBlankERC721() {
  const BlankERC721 = await ethers.getContractFactory("BlankERC721");

  const blankERC721 = await BlankERC721.deploy();

  await blankERC721.deployed();

  return blankERC721;
}

async function deployBlankERC20() {
  const BlankERC20 = await ethers.getContractFactory("BlankERC20");

  const blankERC20 = await BlankERC20.deploy();

  await blankERC20.deployed();

  return blankERC20;
}

async function deployBlankMarketplace(blankERC20Address) {
  const BlankMarketplace = await ethers.getContractFactory("BlankMarketplace");

  const blankMarketplace = await BlankMarketplace.deploy(blankERC20Address);

  await blankMarketplace.deployed();

  return blankMarketplace;
}

async function deployBlankHubWithDeps() {
  const blankERC20 = await deployBlankERC20();

  const BlankHub = await ethers.getContractFactory("BlankHub");

  const blankHub = await BlankHub.deploy(blankERC20.address);

  await blankHub.deployed();

  await blankERC20.setMintCap(ethers.utils.parseUnits("1000"));

  await blankERC20.mint(blankHub.address, ethers.utils.parseUnits("1000"));

  return [blankHub, blankERC20];
}

module.exports = {
  deployBlankERC20,
  deployBlankERC721,
  deployBlankMarketplace,
  deployBlankHubWithDeps,
};

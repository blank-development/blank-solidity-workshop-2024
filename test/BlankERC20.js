const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("BlankERC20", function () {
  let blankERC20;

  let owner, user2;

  let ONE_ETHER = ethers.utils.parseUnits("1");
  let TWO_ETHER = ethers.utils.parseUnits("2");

  beforeEach(async function () {
    const BlankERC20 = await ethers.getContractFactory("BlankERC20");

    blankERC20 = await BlankERC20.deploy();

    await blankERC20.deployed();

    await blankERC20.setMintCap(TWO_ETHER);
    await blankERC20.setTransferCap(TWO_ETHER);

    [owner, user2] = await ethers.getSigners();
  });

  it("should return correct name", async function () {
    const name = await blankERC20.name();

    expect(name).to.equal("Blank Token");
  });

  it("should return correct symbol", async function () {
    const symbol = await blankERC20.symbol();

    expect(symbol).to.equal("BT");
  });

  it("Should mint tokens correctly", async function () {
    const amountToMint = ONE_ETHER;

    await blankERC20.mint(owner.address, amountToMint);

    const balanceAfterMint = await blankERC20.balanceOf(owner.address);

    expect(balanceAfterMint).to.equal(amountToMint);
  });

  it("Should fail to mint above the cap", async function () {
    const mintCap = ONE_ETHER;
    const amountAboveCap = TWO_ETHER;

    await blankERC20.setMintCap(mintCap);

    await expect(
      blankERC20.mint(owner.address, amountAboveCap)
    ).to.be.revertedWith("Mint amount exceeds cap");
  });

  it("Should update and query mint cap correctly", async function () {
    const expectedMintCap = ONE_ETHER;

    await blankERC20.setMintCap(expectedMintCap);

    const newMintCap = await blankERC20.getMintCap();

    expect(newMintCap).to.equal(expectedMintCap);
  });

  it("Should transfer tokens correctly", async function () {
    const amountToMint = ONE_ETHER;

    await blankERC20.mint(owner.address, amountToMint);

    const amountToTransfer = ethers.utils.parseUnits("0.5");

    await blankERC20.transfer(user2.address, amountToTransfer);

    const balanceAfterTransfer = await blankERC20.balanceOf(owner.address);

    expect(balanceAfterTransfer).to.equal(amountToTransfer);
  });

  it("Should fail to transfer above the cap", async function () {
    const mintedToken = ONE_ETHER;

    const amountAboveCap = ethers.utils.parseUnits("2");

    await blankERC20.setTransferCap(mintedToken);

    await expect(
      blankERC20.transfer(user2.address, amountAboveCap)
    ).to.be.revertedWith("Transfer amount exceeds cap");
  });

  it("Should update and query transfer cap correctly", async function () {
    const expectedCap = ONE_ETHER;

    await blankERC20.setTransferCap(expectedCap);

    const newCap = await blankERC20.getTransferCap();

    expect(newCap).to.equal(expectedCap);
  });

  it("Should emit BlankTransfer event correctly", async function () {
    const amountToTransfer = ONE_ETHER;

    await blankERC20.mint(owner.address, amountToTransfer);

    const transferTx = blankERC20.transfer(user2.address, amountToTransfer);

    await expect(transferTx)
      .to.emit(blankERC20, "BlankTransfer")
      .withArgs(owner.address, user2.address, "Transfer occurred");
  });

  it("Should emit BlankBurn event correctly", async function () {
    const amountToBurn = ONE_ETHER;

    await blankERC20.mint(owner.address, amountToBurn);

    const burnTx = await blankERC20.burn(amountToBurn);

    await expect(burnTx)
      .to.emit(blankERC20, "BlankBurn")
      .withArgs(owner.address, amountToBurn, "Burn occurred");
  });

  it("Should update unique holder count correctly", async function () {
    const expectedHolderCount = 1;

    const amountToMint = ONE_ETHER;

    await blankERC20.mint(owner.address, amountToMint);

    const currentHolders = await blankERC20.uniqueHolderCount();

    expect(currentHolders).to.equal(expectedHolderCount);
  });

  it("Should allow voting with tokens", async function () {
    const expectedVotes = ONE_ETHER;

    await blankERC20.mint(owner.address, expectedVotes);

    await blankERC20.vote(expectedVotes);

    const votesCountAfterVote = await blankERC20.votes(owner.address);

    expect(votesCountAfterVote).to.equal(expectedVotes);
  });
});

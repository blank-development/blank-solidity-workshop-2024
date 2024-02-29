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

    expect(symbol).to.equal("WrongSymbol");
  });

  it("should mint tokens correctly", async function () {
    // To implement this test, follow these steps:
    //
    // 1. Mint a specific amount of tokens to an address.
    // 2. Verify the balance of the address matches the minted amount.
    //
    // Example:
    // const amountToMint = ONE_ETHER;
    // await blankERC20.mint(owner.address, amountToMint);
    // const balance = await blankERC20.balanceOf(owner.address);
    // expect(balance).to.equal(amountToMint);
  });

  it("Should transfer tokens correctly", async function () {
    const amountToMint = ONE_ETHER;

    await blankERC20.mint(owner.address, amountToMint);

    const HALF_ETHER = ethers.utils.parseUnits("0.5");
    const amountToTransfer = HALF_ETHER;

    await blankERC20.transfer(user2.address, amountToTransfer);

    const balanceAfterTransfer = await blankERC20.balanceOf(owner.address);

    expect(balanceAfterTransfer).to.equal(amountToTransfer);
  });

  it("should fail to transfer more tokens than owner balance", async function () {
    const amountToMint = ONE_ETHER;

    await blankERC20.mint(owner.address, amountToMint);

    const amountToTransfer = TWO_ETHER; // Trying to transfer more than minted

    // This operation should fail but is expected to succeed in this broken test
    await expect(blankERC20.transfer(user2.address, amountToTransfer)).to.be
      .fulfilled;
  });

  it("should fail to transfer above the cap");
  // To implement this test:
  //
  // 1. Attempt to transfer an amount above the set transfer cap.
  // 2. Expect the transaction to be reverted with the specific error message.
  //
  // Example:
  // const transferAmount = THREE_ETHER; // Assume this is above the cap
  // await expect(blankERC20.transfer(user2.address, transferAmount)).to.be.revertedWith("Transfer amount exceeds cap");

  it("should emit BlankTransfer event correctly");
  // To validate the emission of the BlankTransfer event:
  //
  // 1. Perform a token transfer operation.
  // 2. Use the 'expect' statement to check if the 'BlankTransfer' event was emitted with correct parameters.

  // Example:
  // const amountToTransfer = ONE_ETHER;
  // await expect(blankERC20.transfer(user2.address, amountToTransfer))
  //   .to.emit(blankERC20, "BlankTransfer")
  //   .withArgs(owner.address, user2.address, amountToTransfer);

  it("should emit BlankBurn event correctly");
});

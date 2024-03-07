const { expect } = require("chai"); // Importing Chai for assertions
const { ethers } = require("hardhat"); // Importing ethers from Hardhat
const {
  deployBlankERC20,
  deployBlankERC721,
  deployBlankMarketplace,
} = require("./utils"); // Utility functions for deploying contracts

describe("BlankMarketplace", function () {
  let blankERC20, blankERC721, blankMarketplace; // Variables for the contracts
  let addr1, addr2, addr3; // Variables for different addresses

  beforeEach(async function () {
    // Deploying the ERC20, NFT, and Marketplace contracts
    blankERC20 = await deployBlankERC20();
    blankERC721 = await deployBlankERC721();
    blankMarketplace = await deployBlankMarketplace(blankERC20.address);

    [addr1, addr2, addr3] = await ethers.getSigners(); // Retrieving signer accounts

    // Sending Ether from addr1 to addr2 for testing purposes
    await addr1.sendTransaction({
      to: addr2.address,
      value: ethers.utils.parseEther("1.0"),
    });

    // Minting NFT and ERC20 tokens for testing
    await blankERC721.mint("example_token_uri");
    await blankERC20.mint(addr1.address, 1000);
    await blankERC20.mint(addr2.address, 1000);

    // Approving the marketplace to spend addr1's and addr2's ERC20 tokens
    await blankERC20.approve(blankMarketplace.address, 1000);
    await blankERC20.connect(addr2).approve(blankMarketplace.address, 1000);

    // Approving the marketplace to transfer the minted NFT
    await blankERC721.approve(blankMarketplace.address, 1);
  });

  describe("Auction Creation", function () {
    it("Should create an auction", async function () {
      // Not awaiting the transaction, causing the test to pass incorrectly
      const listNftTx = blankMarketplace
        .connect(addr1)
        .putOnSale(blankERC721.address, 1, 100); // HINT: Transactions should be awaited

      const auctionID = await blankMarketplace.createAuctionId(
        blankERC721.address,
        1,
        addr1.address
      );

      // Checking if the AuctionCreated event is emitted correctly
      await expect(listNftTx)
        .to.emit(blankMarketplace, "AuctionCreated")
        .withArgs(auctionID, blankERC721.address, 1, addr1.address, 100);
    });

    it("Should revert when a non-owner tries to create an auction", async function () {
      const putOnSaleTx = blankMarketplace
        .connect(addr2)
        .putOnSale(blankERC721.address, 1, 100);

      // Incorrect custom error
      await expect(putOnSaleTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "InvalidPrice" // HINT: Check the actual custom error for non-owners
      );
    });

    it("Should revert if the price is zero or negative", async function () {
      const putOnSaleTx = blankMarketplace.putOnSale(blankERC721.address, 1, 0);

      // Checking if the custom error InvalidPrice is thrown
      await expect(putOnSaleTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "InvalidPrice"
      );
    });
  });

  describe("Buy", function () {
    it("Should allow a user to buy an NFT", async function () {
      const priceOfNFT = 100;

      await blankMarketplace.putOnSale(blankERC721.address, 1, priceOfNFT);

      const auctionID = await blankMarketplace.createAuctionId(
        blankERC721.address,
        1,
        addr1.address
      );

      const buyNftTx = blankMarketplace.connect(addr2).buyNFT(auctionID);

      // 1. Check if buyNftTx emits `AuctionSuccessfull` with appropriate args.
      // 2. For reference check test `Should create an auction`
      // 3. After buy ensure that buyer is the owner of the NFT.
      // 4. Use blankERC721.ownerOf() function for this check.
    });

    it("Should revert when buying an NFT with insufficient funds", async function () {
      const priceOfNft = 10000;

      await blankMarketplace
        .connect(addr1)
        .putOnSale(blankERC721.address, 1, priceOfNft);

      const auctionID = await blankMarketplace.createAuctionId(
        blankERC721.address,
        1,
        addr1.address
      );

      // 1. Call buyNFT with addr2.
      // 2. Expect `InsufficientFunds` error to be thrown.
    });
  });

  describe("Removing Auctions", function () {
    // Test case for allowing a seller to remove an auction
    it("Should allow the seller to remove an auction", async function () {
      // Create an auction for sale
      await blankMarketplace.putOnSale(blankERC721.address, 1, 200);

      // 1. Call `createAuctionId` to get auctionID.
      // 2. Use it to inside `removeFromSale` function.
      // 3. Expect that function emits `AuctionCanceled` event with proper args.
      // 4. Try to call `getAuction` after canceling.
      // 5. Except revert with `InvalidAuction` error.
    });

    // Test case for reverting if a non-seller tries to remove the auction
    it("Should revert if a non-seller tries to remove the auction", async function () {
      // Put an NFT on sale
      await blankMarketplace.putOnSale(blankERC721.address, 1, 300);

      // 1. Call `createAuctionId` to get auctionID.
      // 2. Use it to inside `removeFromSale` function.
      // 3. Call `removeFromSale` with addr2 account.
      // 4. Expect it to be reverted with proper error.
    });

    // Test case for reverting if trying to remove a non-existent auction
    it("Should revert if trying to remove a non-existent auction", async function () {
      // Generate an auction ID for a non-existent auction
      const nonExistentAuctionId = ethers.utils.id("nonexistent");

      // Attempt to remove a non-existent auction
      const removeFromSaleTx = blankMarketplace
        .connect(addr1)
        .removeFromSale(nonExistentAuctionId);

      // Incorrect custom error check
      await expect(removeFromSaleTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "AuctionActive" // HINT: Check the actual custom error for trying to remove a non-existent auction
      );
    });
  });
});

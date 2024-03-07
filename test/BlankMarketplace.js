const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  deployBlankERC20,
  deployBlankERC721,
  deployBlankMarketplace,
} = require("./utils");

describe("BlankMarketplace", function () {
  let blankERC20, blankERC721, blankMarketplace;
  let addr1, addr2, addr3;

  beforeEach(async function () {
    blankERC20 = await deployBlankERC20();
    blankERC721 = await deployBlankERC721();

    blankMarketplace = await deployBlankMarketplace(blankERC20.address);

    [addr1, addr2, addr3] = await ethers.getSigners();

    await addr1.sendTransaction({
      to: addr2.address,
      value: ethers.utils.parseEther("1.0"),
    });

    // Mint NFT and allocate ERC20 tokens for testing
    await blankERC721.mint("example_token_uri");

    // 1000 BlankToken to owner
    await blankERC20.mint(addr1.address, 1000);
    await blankERC20.mint(addr2.address, 1000);

    // Approve marketplace to spend addr1's BlankToken
    await blankERC20.approve(blankMarketplace.address, 1000);
    await blankERC20.connect(addr2).approve(blankMarketplace.address, 1000);

    // Approve marketplace to transfer our NFT
    await blankERC721.approve(blankMarketplace.address, 1);
  });

  describe("Auction Creation", function () {
    it("Should create an auction", async function () {
      const listNftTx = blankMarketplace
        .connect(addr1)
        .putOnSale(blankERC721.address, 1, 100);

      const auctionID = await blankMarketplace.createAuctionId(
        blankERC721.address,
        1,
        addr1.address
      );

      await expect(listNftTx)
        .to.emit(blankMarketplace, "AuctionCreated")
        .withArgs(auctionID, blankERC721.address, 1, addr1.address, 100);
    });

    it("Should revert when a non-owner tries to create an auction", async function () {
      const putOnSaleTx = blankMarketplace
        .connect(addr2)
        .putOnSale(blankERC721.address, 1, 100);

      await expect(putOnSaleTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "InvalidCaller"
      );
    });

    it("Should revert if the price is zero or negative", async function () {
      const putOnSaleTx = blankMarketplace.putOnSale(blankERC721.address, 1, 0);

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

      await expect(buyNftTx)
        .to.emit(blankMarketplace, "AuctionSuccessfull")
        .withArgs(
          auctionID,
          blankERC721.address,
          1,
          addr1.address,
          addr2.address,
          priceOfNFT
        );

      const newOwner = await blankERC721.ownerOf(1);

      expect(newOwner).to.equal(addr2.address);
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

      const buyNftTx = blankMarketplace.connect(addr2).buyNFT(auctionID);

      await expect(buyNftTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "InsufficientFunds"
      );
    });

    it("Should revert when buying from an invalid auction", async function () {
      let invalidAuctionId = ethers.utils.id("nonexistent");

      const buyNftTx = blankMarketplace.connect(addr2).buyNFT(invalidAuctionId);

      await expect(buyNftTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "InvalidAuction"
      );
    });
  });

  describe("Removing Auctions", function () {
    it("Should allow the seller to remove an auction", async function () {
      await blankMarketplace.putOnSale(blankERC721.address, 1, 200);

      const auctionID = await blankMarketplace.createAuctionId(
        blankERC721.address,
        1,
        addr1.address
      );

      const removeForSaleTx = blankMarketplace.removeFromSale(auctionID);

      await expect(removeForSaleTx)
        .to.emit(blankMarketplace, "AuctionCanceled")
        .withArgs(auctionID);

      const getAuctionTx = blankMarketplace.getAuction(auctionID);

      expect(getAuctionTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "InvalidAuction"
      );
    });

    it("Should revert if a non-seller tries to remove the auction", async function () {
      await blankMarketplace.putOnSale(blankERC721.address, 1, 300);

      const auctionID = await blankMarketplace.createAuctionId(
        blankERC721.address,
        1,
        addr1.address
      );

      const removeFromSaleTx = blankMarketplace
        .connect(addr2)
        .removeFromSale(auctionID);

      await expect(removeFromSaleTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "InvalidCaller"
      );
    });

    it("Should revert if trying to remove a non-existent auction", async function () {
      const nonExistentAuctionId = ethers.utils.id("nonexistent");

      const removeFromSaleTx = blankMarketplace
        .connect(addr1)
        .removeFromSale(nonExistentAuctionId);

      await expect(removeFromSaleTx).to.be.revertedWithCustomError(
        blankMarketplace,
        "InvalidAuction"
      );
    });
  });
});

const { ethers } = require("hardhat");
const { expect } = require("chai");
const { deployBlankERC721 } = require("./utils");

describe("BlankERC721", function () {
  let blankERC721;
  let owner, user2;

  beforeEach(async function () {
    blankERC721 = await deployBlankERC721();

    [owner, user2] = await ethers.getSigners();
  });

  it("should correctly mint a new NFT", async function () {
    const tokenURI = "ipfs://example";
    await blankERC721.mint(tokenURI);

    const ownerOfToken = await blankERC721.ownerOf(1);

    expect(ownerOfToken).to.equal(owner.address);
  });

  it("owner should be able to mint multiple NFTs", async function () {
    const tokenURI1 = "ipfs://example1";
    await blankNFT.mint(tokenURI1);

    expect(await blankNFT.ownerOf(1)).to.equal(owner.address);
    expect(await blankNFT.tokenURI(1)).to.equal(tokenURI1);

    const tokenURI2 = "ipfs://example2";
    await blankNFT.mint(tokenURI2);

    expect(await blankNFT.ownerOf(2)).to.equal(owner.address);
    expect(await blankNFT.tokenURI(2)).to.equal(tokenURI2);
  });

  it("should return correct token URI after minting", async function () {
    const tokenURI = "ipfs://example";

    await blankERC721.mint(tokenURI);

    const fetchedURI = await blankERC721.tokenURI(1);

    expect(fetchedURI).to.equal(tokenURI);
  });

  it("should correctly return total supply", async function () {
    for (let i = 0; i < 5; i++) {
      await blankNFT.mint(`ipfs://example${i}`);
    }

    expect(await blankNFT.totalSupply()).to.equal(2);
  });

  it("should fail to transfer NFT if sender is not owner", async function () {
    await blankERC721.mint("ipfs://example");

    // Way to call function with user2 rather than owner.
    // Use hardhat `connect()` function.
    // Eg. blankERC721.connect(user2).transferFrom()

    await expect(
      blankERC721.connect(user2).transferFrom(owner.address, user2.address, 1)
    ).to.not.be.reverted;
  });

  it("should emit a Transfer event when an NFT is minted", async function () {
    const tokenURI = "ipfs://unique-uri";

    // Listen for the Transfer event upon minting a new NFT and verify the event's parameters.
    await expect(blankERC721.mint(tokenURI))
      .to.emit(blankERC721, "Transfer")
      .withArgs(ethers.constants.AddressZero, user2.address, 1);
  });

  it("should burn an NFT correctly");
  // Steps for implementing a test
  // 1. Mint a new NFT.
  // 2. Call the burn function on the newly minted NFT.
  // 3. Attempt to fetch the owner of the burned NFT and expect the call to be reverted.
});

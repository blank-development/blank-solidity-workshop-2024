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
    const tokenURI = "example";
    await blankERC721.mint(tokenURI);

    const ownerOfToken = await blankERC721.ownerOf(1);
    expect(ownerOfToken).to.equal(owner.address);
  });

  it("owner should be able to mint multiple NFTs", async function () {
    const tokenURI1 = "example1";
    const fullTokenURI1 = "ipfs://example1";

    await blankERC721.mint(tokenURI1);
    expect(await blankERC721.ownerOf(1)).to.equal(owner.address);
    expect(await blankERC721.tokenURI(1)).to.equal(fullTokenURI1);

    const tokenURI2 = "example2";
    const fullTokenURI2 = "ipfs://example2";

    await blankERC721.mint(tokenURI2);
    expect(await blankERC721.ownerOf(2)).to.equal(owner.address);
    expect(await blankERC721.tokenURI(2)).to.equal(fullTokenURI2);
  });

  it("should return correct token URI after minting", async function () {
    const tokenURI = "example";
    const fullTokenURI = "ipfs://example";
    await blankERC721.mint(tokenURI);

    const fetchedURI = await blankERC721.tokenURI(1);
    expect(fetchedURI).to.equal(fullTokenURI);
  });

  it("should correctly return total supply", async function () {
    for (let i = 0; i < 5; i++) {
      await blankERC721.mint(`example${i}`);
    }
    expect(await blankERC721.totalSupply()).to.equal(5);
  });

  it("should fail to transfer NFT if sender is not owner", async function () {
    await blankERC721.mint("example");
    await expect(
      blankERC721.connect(user2).transferFrom(owner.address, user2.address, 1)
    ).to.be.reverted;
  });

  it("should emit a Transfer event when an NFT is minted", async function () {
    const tokenURI = "unique-uri";
    await expect(blankERC721.mint(tokenURI))
      .to.emit(blankERC721, "Transfer")
      .withArgs(ethers.constants.AddressZero, owner.address, 1);
  });

  it("should burn an NFT correctly", async function () {
    await blankERC721.mint("example");
    await expect(blankERC721.burn(1))
      .to.emit(blankERC721, "Transfer")
      .withArgs(owner.address, ethers.constants.AddressZero, 1);

    await expect(blankERC721.ownerOf(1)).to.be.reverted;
  });
});

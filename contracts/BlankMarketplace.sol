// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./erc721/BlankERC721.sol";
import "./erc20/BlankERC20.sol";

error InvalidAuction();
error InvalidPrice();
error InsufficientFunds();

contract BlankMarketplace {
    struct Auction {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 startedAt;
    }

    modifier onlyValidNftOwner(address nftContract, uint256 tokenId) {
        if (ERC721(nftContract).ownerOf(tokenId) != msg.sender) {
            revert InvalidCaller();
        }

        _;
    }

    BlankERC20 public paymentToken;

    mapping(bytes32 => Auction) private auctions;

    event AuctionCreated(
        bytes32 indexed auctionId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint price
    );

    event AuctionSuccessfull(
        bytes32 indexed auctionId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint price
    );

    event AuctionCanceled(bytes32 indexed auctionId);

    constructor(address _paymentTokenAddress) {
        paymentToken = BlankERC20(_paymentTokenAddress);
    }

    function putOnSale(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external onlyValidNftOwner(nftContract, tokenId) {
        if (price <= 0) {
            revert InvalidPrice();
        }

        bytes32 auctionId = createAuctionId(nftContract, tokenId, msg.sender);

        auctions[auctionId] = Auction({
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            seller: msg.sender,
            startedAt: block.timestamp
        });

        emit AuctionCreated(auctionId, nftContract, tokenId, msg.sender, price);
    }

    function buyNFT(bytes32 auctionId) external {
        Auction memory auction = getAuction(auctionId);

        if (paymentToken.balanceOf(msg.sender) < auction.price) {
            revert InsufficientFunds();
        }

        _transferNFT(auction);

        _removeAuction(auctionId);

        emit AuctionSuccessfull(
            auctionId,
            auction.nftContract,
            auction.tokenId,
            auction.seller,
            msg.sender,
            auction.price
        );
    }

    function removeFromSale(bytes32 auctionId) external {
        Auction memory auction = getAuction(auctionId);

        if (auction.seller != msg.sender) {
            revert InvalidCaller();
        }

        _removeAuction(auctionId);

        emit AuctionCanceled(auctionId);
    }

    function createAuctionId(
        address nftContract,
        uint256 tokenId,
        address seller
    ) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(nftContract, "-", tokenId, "-", seller));
    }

    function getAuction(
        bytes32 auctionId
    ) public view returns (Auction memory) {
        Auction memory auction = auctions[auctionId];

        if (auction.startedAt <= 0) {
            revert InvalidAuction();
        }

        return auction;
    }

    function _transferNFT(Auction memory auction) private {
        paymentToken.transferFrom(msg.sender, auction.seller, auction.price);

        ERC721(auction.nftContract).transferFrom(
            auction.seller,
            msg.sender,
            auction.tokenId
        );
    }

    function _removeAuction(bytes32 auctionId) private {
        delete auctions[auctionId];
    }
}

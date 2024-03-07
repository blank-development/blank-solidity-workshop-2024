// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

// Import statements for the BlankERC721 and BlankERC20 contracts.
import "./erc721/BlankERC721.sol";
import "./erc20/BlankERC20.sol";

error InvalidAuction();
error InvalidPrice();
error InsufficientFunds();

contract BlankMarketplace {
    BlankERC20 public paymentToken;

    struct Auction {
        address nftContract;
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 startedAt;
    }

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

    // TASK 1: Define a mapping structure for auctions

    // References:
    // See how to define mappings: https://solidity-by-example.org/mapping/

    // Steps:
    // 1. Mapping should map `bytes32` key to `Auction` struct value.
    // 2. Name it `auctions` and make it private.

    // ------------------------------------------------------------------------------------------

    // TASK 2: Define a modifier to check if the message sender is the owner of the NFT

    // References:
    // See how to define modifier: https://solidity-by-example.org/function-modifier/
    // See how to require rule defined in task: https://solidity-by-example.org/error/

    // Steps:
    // 1. Verify that the caller owns the NFT in the specified contract and token ID.
    // 2. If not, revert with an InvalidCaller error.

    // ------------------------------------------------------------------------------------------

    // TASK 3: Listing an NFT for Sale

    // References:
    // See how to store newly created auction into the `auctions` mapping: https://solidity-by-example.org/mapping/
    // See how to emit event: https://solidity-by-example.org/events/
    // See `msg` global object for getting seller address: https://docs.soliditylang.org/en/latest/units-and-global-variables.html#block-and-transaction-properties

    // Steps:
    // 1. Create a function `putOnSale` allowing NFT owners to list their NFT for sale.
    // 2. Function should accept following parameters: `address nftContract`, `uint256 tokenId`, `uint256 price`
    // 2. Verify the sale price is greater than 0; otherwise, revert with InvalidPrice.
    // 3. Generate a unique auction ID for the listing. Use `createAuctionId` function for this.
    // 4. Store the auction details in the mapping `auctions`.
    // 5. Emit an AuctionCreated event with the relevant details.

    // ------------------------------------------------------------------------------------------

    // TASK 4: Buying an NFT

    // References:
    // See how to remove auction from mapping: https://solidity-by-example.org/mapping/
    // See how to emit event: https://solidity-by-example.org/events/

    // Steps:
    // 1. Create a function `buyNFT` for users to purchase listed NFTs.
    // 2. Function should accept `bytes32 auctionId`.
    // 3. Use `getAuctionId` to get the auction from the storage.
    // 4. Verify the buyer has enough ERC20 tokens; otherwise, revert with appropriate error.
    // 5. Call internal `_transferAssets` function to transfer NFT and ERC20 funds to buyer and seller addresses respectively.
    // 6. Remove the auction from the mapping.
    // 7. Emit an AuctionSuccessful event with the purchase details.

    // Note: To check if user has enough ERC20 tokens use `paymentToken.balanceOf();`

    // ------------------------------------------------------------------------------------------

    // TASK 5: Canceling a Listing

    // References:
    // See `msg` global object for getting seller address: https://docs.soliditylang.org/en/latest/units-and-global-variables.html#block-and-transaction-properties
    // See how to remove auction from mapping: https://solidity-by-example.org/mapping/
    // See how to emit event: https://solidity-by-example.org/events/

    // Steps:
    // 1. Create a function `removeFromSale` allowing sellers to cancel their listings.
    // 2. It should accept `bytes32 auctionId` parameter.
    // 3. Use `getAuctionId` to get the auction from the storage.
    // 4. Verify the caller is the seller of the NFT.
    // 5. Remove the auction from the mapping.
    // 5. Emit an AuctionCanceled event.

    // ------------------------------------------------------------------------------------------

    /**
     * @dev Generates a unique auction ID based on the NFT contract address, token ID, and seller address.
     * This function uses the keccak256 hash function to encode and concatenate the input parameters,
     * ensuring the generation of a unique identifier for each auction.
     *
     * @param nftContract The address of the ERC721 contract where the NFT is minted.
     * @param tokenId The unique identifier for the NFT within its contract.
     * @param seller The address of the current owner of the NFT who is creating the auction.
     * @return bytes32 Returns a unique bytes32 hash representing the auction ID.
     */
    function createAuctionId(
        address nftContract,
        uint256 tokenId,
        address seller
    ) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(nftContract, "-", tokenId, "-", seller));
    }

    /**
     * @dev Retrieves the auction details for a given auction ID. Reverts if the auction does not exist
     * or has not been started. This ensures that only valid and active auctions are interacted with.
     *
     * @param auctionId The unique identifier of the auction to retrieve.
     * @return Auction Returns an Auction struct containing details about the auction such as the NFT contract,
     * token ID, seller address, price, and the start time of the auction.
     */
    function getAuction(
        bytes32 auctionId
    ) public view returns (Auction memory) {
        Auction memory auction = auctions[auctionId];

        if (auction.startedAt <= 0) {
            revert InvalidAuction();
        }

        return auction;
    }

    /**
     * @dev Internally transfers the payment from the buyer to the seller and the NFT from the seller to the buyer.
     * This function encapsulates the asset transfer logic required to complete an auction sale.
     * It's called internally after an auction has successfully met the conditions for a sale.
     *
     * @param auction The Auction struct containing details necessary to execute the transfers, including
     * the NFT contract address, token ID, seller's address, and the agreed-upon price.
     *
     */
    function _transferAssets(Auction memory auction) private {
        paymentToken.transferFrom(msg.sender, auction.seller, auction.price);

        ERC721(auction.nftContract).transferFrom(
            auction.seller,
            msg.sender,
            auction.tokenId
        );
    }
}

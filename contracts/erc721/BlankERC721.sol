// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

// First, import the required OpenZeppelin contracts for ERC721, URI storage, burnable functionality, and ownership management.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error InvalidCaller();

contract BlankERC721 is ERC721URIStorage, Ownable {
    string public constant baseURI = "ipfs://";

    uint256 public latestTokenId;
    uint256 private burnCounter;

    constructor() ERC721("BlankERC721", "BERC721") {}

    // TASK 1: Minting NFTs

    // References:
    // See how to declare function: https://solidity-by-example.org/function/
    // See how to require rule defined in task: https://solidity-by-example.org/error/

    // Steps:
    // 1. Create a 'mint' function that can only be called by the contract owner to ensure control over NFT creation.
    // 2. This function should accept a URI (Uniform Resource Identifier) as a parameter. Call it `tokenUri`.
    // 3. Increment (use prefix increment) the 'latestTokenId' to ensure each token has a unique ID and use it for following steps.
    // 4. Use the '_safeMint' function to mint the token to the owner's address.
    // 5. Use the '_setTokenURI' function to set the token's URI, linking to its metadata.

    // ------------------------------------------------------------------------------------------

    // TASK 2: Burning NFTs

    // References:
    // See how to require rule defined in task: https://solidity-by-example.org/error/
    // See `msg` global object reference: https://docs.soliditylang.org/en/latest/units-and-global-variables.html#block-and-transaction-properties

    // Steps:
    // 1. Implement a 'burn' function that allows token holders or approved addresses to destroy a token, specifying its ID.
    // 2. Use a check statement to ensure that the caller is authorized to burn the token, otherwise revert with `InvalidCaller()`
    // 3. Increment the 'burnCounter' to keep track of how many tokens have been burned.
    // 4. Call the '_burn' function to remove the token from existence.

    // ------------------------------------------------------------------------------------------

    // TASK 3: Querying Token URI

    // References:
    // See view functions: https://solidity-by-example.org/view-and-pure-functions/
    // See `override` functionality: https://solidity-by-example.org/inheritance/

    // Steps:
    // 1. Override the 'tokenURI' function to return the metadata URI of a specified token ID.
    // 2. Accept `uint256 tokenId` as a parameter.
    // 3. Ensure the function correctly fetches the URI by calling the base class implementation.

    // ------------------------------------------------------------------------------------------

    // TASK 4: Track Total Supply

    // References:
    // See view functions: https://solidity-by-example.org/view-and-pure-functions/

    // Steps:
    // 1. Implement a 'totalSupply' function that calculates and returns the number of tokens that have been minted but not burned.

    // Note: Total supply is number of existing tokens (burned tokens are not considered into calculation)

    // ------------------------------------------------------------------------------------------

    // TASK 5: Overriding Base URI

    // References:
    // See view functions: https://solidity-by-example.org/view-and-pure-functions/
    // See `override` functionality: https://solidity-by-example.org/inheritance/

    // Steps:
    // 1. Override the '_baseURI' function to return the base URI for your NFTs.
    // 2. Check baseURI global variable.
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

error InvalidCaller();

contract BlankERC721 is ERC721URIStorage, Ownable {
    string public constant baseURI = "ipfs://";

    uint256 public latestTokenId;
    uint256 private burnCounter;

    constructor() ERC721("BlankNFT", "BNFT") Ownable() {}

    function mint(string memory uri) external onlyOwner {
        uint256 newTokenID = ++latestTokenId;

        _safeMint(msg.sender, newTokenID);
        _setTokenURI(newTokenID, uri);
    }

    function burn(uint tokenId) external {
        if (!_isApprovedOrOwner(_msgSender(), tokenId)) {
            revert InvalidCaller();
        }

        ++burnCounter;

        _burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function totalSupply() external view returns (uint256) {
        return latestTokenId - burnCounter;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
}

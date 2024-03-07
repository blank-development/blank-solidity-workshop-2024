// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BlankERC20 is ERC20, Ownable {
    mapping(address => bool) private hasBeenHolder;

    mapping(address => uint256) public votes;

    uint256 public uniqueHolderCount;

    uint256 public mintPerTxCap;
    uint256 public transferPerTxCap;

    event BlankTransfer(address from, address to, string message);
    event BlankBurn(address burner, uint256 amount, string message);

    constructor() ERC20("Blank Token", "BT") {
        mintPerTxCap = 10 ether;
        transferPerTxCap = 10 ether;
    }

    function mint(address to, uint256 amount) public {
        require(amount <= mintPerTxCap, "Mint amount exceeds cap");

        if (!hasBeenHolder[to]) {
            uniqueHolderCount++;
            hasBeenHolder[to] = true;
        }

        _mint(to, amount);
    }

    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        require(amount <= transferPerTxCap, "Transfer amount exceeds cap");

        if (!hasBeenHolder[recipient]) {
            uniqueHolderCount++;
            hasBeenHolder[recipient] = true;
        }

        super.transfer(recipient, amount);

        emit BlankTransfer(msg.sender, recipient, "Transfer occurred");

        return true;
    }

    function burn(uint256 amount) public {
        super._burn(msg.sender, amount);

        if (hasBeenHolder[msg.sender]) {
            uniqueHolderCount--;
            hasBeenHolder[msg.sender] = false;
        }

        emit BlankBurn(msg.sender, amount, "Burn occurred");
    }

    function setMintCap(uint256 _cap) public onlyOwner {
        mintPerTxCap = _cap;
    }

    function setTransferCap(uint256 _cap) public onlyOwner {
        transferPerTxCap = _cap;
    }

    function getMintCap() public view returns (uint256) {
        return mintPerTxCap;
    }

    function getTransferCap() public view returns (uint256) {
        return transferPerTxCap;
    }

    function vote(uint256 voteCount) public {
        require(
            balanceOf(msg.sender) >= voteCount,
            "Insufficient balance to vote"
        );

        votes[msg.sender] += voteCount;
    }
}

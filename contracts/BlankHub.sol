// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./erc20/BlankERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error InvalidAmount();
error AlreadyVoted();
error NothingStaked();
error NoRewards();

contract BlankHub is ReentrancyGuard {
    BlankERC20 private blankERC20;

    mapping(address => uint256) private stakes;
    mapping(address => bool) private hasVoted;
    mapping(address => uint256) private rewards;

    event Stake(address indexed user, uint256 amount);
    event Vote(address indexed user, uint256 proposalId);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address _erc20Address) {
        blankERC20 = BlankERC20(_erc20Address);
    }

    function stakeERC20(uint256 amount) external nonReentrant {
        if (amount == 0) {
            revert InvalidAmount();
        }

        require(
            blankERC20.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        stakes[msg.sender] += amount;
        rewards[msg.sender] += 10 * amount;

        emit Stake(msg.sender, amount);
    }

    function vote(uint256 proposalId) external {
        if (stakes[msg.sender] == 0) {
            revert NothingStaked();
        }

        if (hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }

        hasVoted[msg.sender] = true;

        emit Vote(msg.sender, proposalId);
    }

    function claimRewards() external {
        uint reward = rewards[msg.sender];

        if (reward == 0) {
            revert NoRewards();
        }

        rewards[msg.sender] = 0;

        require(
            blankERC20.transfer(msg.sender, reward),
            "Rewards transfer failed"
        );

        emit RewardClaimed(msg.sender, reward);
    }

    function getStakesForAccount() external view returns (uint) {
        return stakes[msg.sender];
    }
}

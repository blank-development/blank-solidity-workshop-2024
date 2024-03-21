// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./erc20/BlankERC20.sol";

contract BlankHub {
    BlankERC20 public blankERC20;

    mapping(address => uint256) public stakes;
    mapping(address => bool) public hasVoted;
    mapping(address => uint256) public rewards;

    constructor(address _erc20Address) {
        blankERC20 = BlankERC20(_erc20Address);
    }

    // TASK 1: Implement stake mechanism

    // See reentrancy attacks examples: https://solidity-by-example.org/hacks/re-entrancy/

    // Steps:
    // 1. Function should be called `stakeERC20` and receive `uint amount` as param.
    // 1. Implement `IERC20.transferFrom` to move tokens from the user to the contract.
    // 3. Consider using the Checks-Effects-Interactions pattern to avoid reentrancy attacks.

    // Security Considerations:
    // Reentrancy Attack: To mitigate the risk of reentrancy attacks, adhere to the Checks-Effects-Interactions pattern.
    // This means you should update your contract's state (checks and effects) before calling external contracts (interactions).
    // Validation: Ensure that the amount of tokens to be staked is greater than zero to prevent zero-value attacks.
    // Transfer Confirmation: Verify the success of the transferFrom function call to ensure tokens are successfully transferred.

    // Example Attack
    // An attacker could exploit the contract by appearing to stake tokens without actually transferring them.
    // This could compromise the staking system's integrity and affect reward distributions.

    // ------------------------------------------------------------------------------------------

    // TASK 2: Implement the voting mechanism

    // Steps:
    // 1. Function should be called `vote`.
    // 2. Implement a mechanism to link votes to stakes, one vote per token staked.
    // 3. Ensure account can vote only once.
    // 4. Ensure proper event logging for each vote to facilitate transparency and auditability.

    // Security Considerations:
    // One Vote Per Token: Link each vote to a staked token to ensure voting power is proportional to stake.
    // Single Vote Enforcement: Implement a mechanism to track if an account has already voted, preventing multiple votes.

    // Example Attack:
    // A user can repeatedly vote, skewing the voting results.

    // ------------------------------------------------------------------------------------------

    // TASK 3: Implement rewards distribution mechanism

    // See pull over push: Pull over push example: https://fravoll.github.io/solidity-patterns/pull_over_push.html

    // Steps:
    // 1. Function should be called `claimRewards`.
    // 2. Calculate rewards based on algorithm `reward = 10 x staked`.
    // 3. Use the pull-over-push pattern for transferring rewards to mitigate reentrancy risks.

    // Security Considerations:
    // Implement the pull-over-push pattern for rewards distribution. This means instead of directly sending rewards to users (push), allow them to withdraw their rewards themselves (pull).
    // Ensure the rewards calculation is secure and accurately reflects the staked amount to prevent manipulation.
    // Update the contract's state regarding claimed rewards before any transfer occurs to mitigate reentrancy risks.

    // Example Attack:
    // An attacker could potentially exploit the rewards distribution to perform a reentrancy attack, withdrawing more rewards than entitled.
}

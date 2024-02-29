// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BlankERC20 is ERC20, Ownable {
    mapping(address => bool) private hasBeenHolder;

    uint256 public uniqueHolderCount;

    uint256 public mintPerTxCap;
    uint256 public transferPerTxCap;

    event BlankTransfer(address from, address to, uint256 amount);
    event BlankBurn(address burner, uint256 amount);

    // TASK 1

    // References:
    // See how to define constructor: https://solidity-by-example.org/constructor

    // Define a constructor that initializes the ERC20 token with a name "Blank Token" and symbol "BT".
    // This constructor should set initial values for mintPerTxCap and transferPerTxCap.
    constructor() ERC20("", "") {}

    // ------------------------------------------------------------------------------------------

    // TASK 2

    // References:
    // See how to declare function: https://solidity-by-example.org/function/
    // See how to use `hasBeenHolder` mapping: https://solidity-by-example.org/mapping/
    // See how to require rule defined in task: https://solidity-by-example.org/error/

    // Implement the mint function with the following requirements:

    // 1. Name it `mint` and accept `address to` and `uint256 amount` as parameters.
    // 2. Check if the amount to be minted does not exceed the mintPerTxCap. Use require to enforce this rule.
    // Note: If it exceeds cap then throw "Mint amount exceeds cap" message.
    // 3. If the recipient has not been a holder, increase uniqueHolderCount and mark them as a holder in hasBeenHolder.
    // 4. Use the _mint function from the ERC20 standard to mint the tokens to the specified address.

    // ------------------------------------------------------------------------------------------

    // TASK 3

    // References:
    // See how to require rule defined in task: https://solidity-by-example.org/error/
    // See `msg` global object reference: https://docs.soliditylang.org/en/latest/units-and-global-variables.html#block-and-transaction-properties
    // See `override` functionality: https://solidity-by-example.org/inheritance/

    // Override the transfer function to include custom logic:

    // 1. Ensure the amount being transferred does not exceed the transferPerTxCap using require.
    // Note: If it exceeds cap then throw "Transfer amount exceeds cap" message.
    // 2. For new recipients (not in hasBeenHolder), increment uniqueHolderCount and update hasBeenHolder.
    // 3. Use super.transfer to perform the transfer operation.
    // 4. Emit a BlankTransfer event with appropriate parameters after a successful transfer.
    // Note: Remember to return a boolean value as per the ERC20 standard.

    // ------------------------------------------------------------------------------------------

    // TASK 4

    // Implement the burn function:
    // 1. Accept `uint256 amount` as a parameter.
    // 2. Call super._burn function to destroy tokens from the caller's balance.
    // 3. Emit a BlankBurn event with the caller's address, amount.

    // This is how burn function signature needs to be defined.
    function burn(uint256 amount) public {}

    // ------------------------------------------------------------------------------------------

    // TASK 5

    // References:
    // We inherit `Ownable` contract see how to use it's functionality to ensure only owner can call it:
    // https://docs.openzeppelin.com/contracts/2.x/access-control

    // Implement the setMintCap and setTransferCap functions that allows only the owner to set caps:
    // 1. Accept `uint256 _cap` as a parameter.
    // 2. Update their global variants with the new cap value.
    // 3. Add necessary access control to ensure only the contract owner can call these functions.

    // ------------------------------------------------------------------------------------------

    // TASK 6

    // References:
    // See view functions: https://solidity-by-example.org/view-and-pure-functions/

    // Implement getter for transferPerTxCap to view their current values:
    // It should be simple public view function that return the respective cap values.

    // ------------------------------------------------------------------------------------------

    // TASK 7

    // References:
    // See view functions: https://solidity-by-example.org/view-and-pure-functions/

    // Implement getter for mintPerTxCap to view their current values:
    // It should be simple public view function that return the respective cap values.

    // ------------------------------------------------------------------------------------------

    // **TASK 8**

    // Implement a voting mechanism where token holders can vote based on their token balance:
    // 1. Accept `uint256 voteCount` as a parameter.
    // 2. Ensure the caller has a balance >= voteCount using require.
    // 3. Update the votes mapping to increment the caller's votes by voteCount.
}

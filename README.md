# **ERC20 Smart Contract Development Workshop**

The workshop's objective is to equip you with the necessary skills to develop and test ERC20 tokens effectively. You will learn the intricacies of the ERC20 standard, engage in hands-on smart contract development, and apply testing techniques to verify your smart contracts' functionality and security.

### Learning Outcomes:

By the end of this workshop, you will:

- Understand the ERC20 token standard and its applications.
- Have practical experience in developing and deploying ERC20 tokens.
- Be proficient in writing and executing tests to ensure your smart contracts are secure and function as intended.

Workshop is divided into two parts:

### **ERC20 Smart Contract Development**

- Introduction to ERC20 Tokens: Understanding the token standard.
- Smart Contract Development: Writing your first ERC20 token using Solidity.
- Deployment: Deploying the contract to a test network.

### **Testing**

- Introduction to smart contract testing.
- Writing Test Cases: Creating positive and negative test scenarios.
- We are using Mocha and Chai libraries for testing:
  - [Mocha](https://mochajs.org/#assertions)
  - [Chai](https://www.chaijs.com/api/assert/)

## **Deploy**

Deploy your ERC20 contract to Sepolia with following command:

```
npx hardhat run scripts/deploy-blank-erc20.js --network sepolia
```

## **Verify**

Verify your ERC20 contract on Etherscan:

```
npx hardhat verify --contract contracts/BlankERC20.sol:BlankERC20 --network sepolia <deployed address>
```

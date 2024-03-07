# **ERC721 Marketplace Development Workshop**

The workshop's objective is to equip you with the necessary skills to develop and test Non-Fungible Tokens (NFTs) and a marketplace to buy and sell these unique digital assets.

### Learning Outcomes:

By the end of this workshop, you will:

- Understand the ERC721 token standard and its applications.
- Understand how simple ERC721 marketplace contract functions.
- Have practical experience in developing and deploying ERC721 tokens and marketplace contracts.
- Be proficient in writing and executing tests to ensure your smart contracts are secure and function as intended.

Workshop is divided into two parts:

### **ERC721 Marketplace Smart Contract Development**

- Introduction to ERC721 Tokens: Understanding the token standard.
- Writing ERC721 NFT contract.
- Writing marketplace contract.
- Deployment: Deploying the contracts to a test network.

### **Testing**

- Introduction to smart contract testing.
- Writing Test Cases: Creating positive and negative test scenarios.
- We are using Mocha and Chai libraries for testing:
  - [Mocha](https://mochajs.org/#assertions)
  - [Chai](https://www.chaijs.com/api/assert/)

## **Deploy**

Deploy your ERC721 contract to Sepolia with following command:

```
npx hardhat run scripts/deploy-blank-erc721.js --network sepolia
```

Deploy your Marketplace contract to Sepolia with following command:

```
npx hardhat run scripts/deploy-blank-marketplace.js --network sepolia
```

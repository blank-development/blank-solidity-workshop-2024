const { expect } = require("chai");
const { deployBlankHubWithDeps } = require("./utils");

describe("BlankHub", function () {
  let blankHub, blankERC20;
  let addr1, addr2;

  beforeEach(async () => {
    [blankHub, blankERC20] = await deployBlankHubWithDeps();

    [addr1, addr2] = await ethers.getSigners();
  });

  describe("Blank Hub", function () {
    it("should stake properly", async function () {});

    it("shouldn't allow staking without transferring ERC20 tokens", async function () {});

    it("should vote properly", async function () {});

    it("shouldn't allow multiple votes from the same address", async function () {});
    it("should claim rewards accordingly", async function () {});
  });
});

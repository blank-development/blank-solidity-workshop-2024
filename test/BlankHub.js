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
    it("should stake properly", async function () {
      const stakeAmount = 100;

      await blankERC20.mint(addr1.address, stakeAmount);
      await blankERC20.approve(blankHub.address, stakeAmount);

      await expect(blankHub.stakeERC20(stakeAmount))
        .to.emit(blankHub, "Stake")
        .withArgs(addr1.address, stakeAmount);

      const userStake = await blankHub.getStakesForAccount();

      expect(userStake).to.equal(stakeAmount);
    });

    it("shouldn't allow staking without transferring ERC20 tokens", async function () {
      const stakeAmount = 100;

      await blankERC20.mint(addr1.address, stakeAmount);
      await blankERC20.approve(blankHub.address, stakeAmount);

      await expect(blankHub.stakeERC20(stakeAmount))
        .to.emit(blankHub, "Stake")
        .withArgs(addr1.address, stakeAmount);

      const balanceAfterStake = await blankERC20.balanceOf(addr1.address);

      expect(balanceAfterStake).to.equal(0);
    });

    it("should vote properly", async function () {
      const stakeAmount = 100;

      await blankERC20.mint(addr1.address, stakeAmount);
      await blankERC20.approve(blankHub.address, stakeAmount);

      await blankHub.stakeERC20(stakeAmount);

      const proposalId = 100;

      await expect(blankHub.vote(proposalId))
        .to.emit(blankHub, "Vote")
        .withArgs(addr1.address, stakeAmount);

      await expect(blankHub.vote(proposalId)).to.be.reverted;
    });

    it("shouldn't allow multiple votes from the same address", async function () {
      const stakeAmount = 200;

      await blankERC20.mint(addr1.address, stakeAmount);
      await blankERC20.approve(blankHub.address, stakeAmount);

      await blankHub.stakeERC20(stakeAmount);

      const proposalId = 100;

      await expect(blankHub.vote(proposalId)).to.be.fulfilled;

      await expect(blankHub.vote(proposalId)).to.be.revertedWithCustomError(
        blankHub,
        "AlreadyVoted"
      );
    });

    it("should claim reward", async function () {
      const initialBalance = await blankERC20.balanceOf(addr1.address);

      const stakeAmount = 100;
      const expectedReward = 10 * stakeAmount - stakeAmount;

      await blankERC20.mint(addr1.address, stakeAmount);
      await blankERC20.approve(blankHub.address, stakeAmount);

      await blankHub.stakeERC20(stakeAmount);

      await blankHub.connect(addr1).claimRewards();

      const finalBalance = await blankERC20.balanceOf(addr1.address);

      const reward = finalBalance.sub(stakeAmount);

      expect(reward).to.be.equal(expectedReward);
    });
  });
});

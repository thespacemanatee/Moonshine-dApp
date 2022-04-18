const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { expectRevert } = require("@openzeppelin/test-helpers");
const Election = artifacts.require("Election");

const { ELIGIBLE_ADDRESSES } = require("../client/mock/index.js");
const uneligibleAccounts = [
  "0x5942d5ECb706e5149EF6a1687028e79C59e547FF",
  "0xA2eF0eC5d15915b644A21AEC588a470765288f5e",
  "0x910C98eF52DFf44C7b691665cc0162B54987E280",
];
const ACCOUNTS = ELIGIBLE_ADDRESSES.concat(uneligibleAccounts);

const ADMIN = "0x67D48113119b405348577149DA39E5249EEb213A";

contract("Election test", async (accounts) => {
  it("should deploy contract with merkle root", async () => {
    this.leafNodes = ELIGIBLE_ADDRESSES.map((address) => keccak256(address));
    this.merkleTree = new MerkleTree(this.leafNodes, keccak256, {
      sortPairs: true,
    });
    this.rootHash = this.merkleTree.getRoot();
    this.instance = await Election.deployed();
    const root = await this.instance.root.call();
    assert.equal(root.slice(2), this.rootHash.toString("hex"));
  });

  it("should create election correctly", async () => {
    await this.instance.initElection("test", "election", { from: ADMIN });
    const electionInfo = await this.instance.getElectionInfo();
    assert.equal(electionInfo[0], "test");
    assert.equal(electionInfo[1], "election");
    assert.equal(electionInfo[2], true);
  });

  it("only admin can create election", async () => {
    await expectRevert(
      this.instance.initElection("test", "election", {
        from: ELIGIBLE_ADDRESSES[0],
      }),
      "Only admin can call this function!"
    );
  });

  it("should add candidates correctly", async () => {
    await this.instance.addCandidate("john", "cena", { from: ADMIN });
    await this.instance.addCandidate("f", "tyrone", { from: ADMIN });
    const candidates = await this.instance.getAllCandidates();
    assert.equal(candidates[0][0], 0);
    assert.equal(candidates[1][0], "john");
    assert.equal(candidates[2][0], "cena");
    assert.equal(candidates[3][0], 0);
    assert.equal(candidates[0][1], 1);
    assert.equal(candidates[1][1], "f");
    assert.equal(candidates[2][1], "tyrone");
    assert.equal(candidates[3][1], "0");
  });

  it("should start election correctly", async () => {
    await this.instance.startElection(1650255469, 1750255469, { from: ADMIN });
    const electionStatus = await this.instance.getElectionStatus();
    assert.equal(electionStatus[0], 1650255469);
    assert.equal(electionStatus[1], 1750255469);
    assert.equal(electionStatus[2], true);
    assert.equal(electionStatus[3], false);
  });

  it("only admin can start election", async () => {
    await expectRevert(
      this.instance.startElection(1650255469, 1750255469, {
        from: ELIGIBLE_ADDRESSES[0],
      }),
      "Only admin can call this function!"
    );
  });

  it("should register voter correctly", async () => {
    ACCOUNTS.forEach(async (address) => {
      await this.instance.registerVoter({ from: address });
      const voters = await this.instance.getAllVoters();
      const addresses = voters[0];
      assert(addresses.includes(address));
    });
  });

  it("should verify voter correctly", async () => {
    ACCOUNTS.forEach(async (address) => {
      await this.instance.verifyVoter(address, { from: ADMIN });
      const voters = await this.instance.getAllVoters();
      const addresses = voters[0];
      const isVerified = voters[2];
      const accountIndex = addresses.findIndex((e) => e === address);
      assert(isVerified[accountIndex]);
    });
  });

  it("only eligible accounts can vote", async () => {
    for (let i = 0; i < ACCOUNTS.length; i++) {
      const proof = this.merkleTree.getHexProof(keccak256(ACCOUNTS[i]));
      if (proof.length !== 0) {
        await this.instance.vote(0, proof, { from: ACCOUNTS[i] });
        assert.equal(await this.instance.voted.call(ACCOUNTS[i]), true);
        await expectRevert(
          this.instance.vote(1, proof, { from: ACCOUNTS[i] }),
          "Already voted!"
        );
      } else {
        await expectRevert(
          this.instance.vote(1, proof, { from: ACCOUNTS[i] }),
          "Incorrect merkle proof!"
        );
      }
    }
  });
});

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
var Election = artifacts.require("Election.sol");

const { ELIGIBLE_ADDRESSES } = require("../mock");

module.exports = function (deployer) {
  const leafNodes = ELIGIBLE_ADDRESSES.map((address) => keccak256(address));
  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const rootHash = merkleTree.getRoot();
  deployer.deploy(Election, rootHash);
};

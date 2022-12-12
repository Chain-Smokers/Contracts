const { expect } = require("chai");
const { ethers } = require("hardhat");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("ElectoralContract", () => {
  const deployContractFixture = async () => {
    const ElectoralContract = await ethers.getContractFactory(
      "ElectoralContract"
    );
    const electoralContract = await ElectoralContract.deploy();
    await electoralContract.deployed();
    return { ElectoralContract, electoralContract };
  };

  it("Add Candidate", async () => {
    const { electoralContract } = await loadFixture(deployContractFixture);

    expect(await electoralContract.getCandidates()).to.eql([]);
    await electoralContract.addCandidate("John Doe");
    expect(await electoralContract.getCandidates()).to.eql(["John Doe"]);
  });

  it("Add Voter", async () => {
    const { electoralContract } = await loadFixture(deployContractFixture);

    expect(await electoralContract.getVoters()).to.eql([]);
    await electoralContract.addVoter("Jane Doe");
    expect(await electoralContract.getVoters()).to.eql(["Jane Doe"]);
  });

  it("Cast Vote", async () => {
    const { electoralContract } = await loadFixture(deployContractFixture);

    await electoralContract.addCandidate("John Doe");
    await electoralContract.addVoter("Jane Doe");

    const preResults = await electoralContract.getResult();
    expect(preResults[0].candidateName).to.equal("John Doe");
    expect(preResults[0].voteCount).to.equal(ethers.BigNumber.from("0"));

    await electoralContract.vote(0, 0);

    const postResults = await electoralContract.getResult();
    expect(postResults[0].candidateName).to.equal("John Doe");
    expect(postResults[0].voteCount).to.equal(ethers.BigNumber.from("1"));
  });
});

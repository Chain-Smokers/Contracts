const { expect } = require("chai");
const { ethers } = require("hardhat");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("ElectoralContract", () => {
  const deployContractFixture = async () => {
    const ElectoralContract = await ethers.getContractFactory(
      "ElectoralContract"
    );
    const electoralContract = await ElectoralContract.deploy([], []);
    await electoralContract.deployed();
    return { ElectoralContract, electoralContract };
  };

  it("Should add candidates and voters on deployment", async () => {
    const ElectoralContract = await ethers.getContractFactory(
      "ElectoralContract"
    );
    const electoralContract = await ElectoralContract.deploy(
      ["Tony Stark", "Steve Rogers"],
      ["John Doe", "Jane Doe"]
    );
    await electoralContract.deployed();
    expect(await electoralContract.getCandidates()).to.eql([
      "Tony Stark",
      "Steve Rogers",
    ]);
    expect(await electoralContract.getVoters()).to.eql([
      "John Doe",
      "Jane Doe",
    ]);
  });

  it("Should add candidate", async () => {
    const { electoralContract } = await loadFixture(deployContractFixture);

    expect(await electoralContract.getCandidates()).to.eql([]);
    await electoralContract.addCandidate("John Doe");
    expect(await electoralContract.getCandidates()).to.eql(["John Doe"]);
  });

  it("Should add voter", async () => {
    const { electoralContract } = await loadFixture(deployContractFixture);

    expect(await electoralContract.getVoters()).to.eql([]);
    await electoralContract.addVoter("Jane Doe");
    expect(await electoralContract.getVoters()).to.eql(["Jane Doe"]);
  });

  it("Should cast vote", async () => {
    const { electoralContract } = await loadFixture(deployContractFixture);

    await electoralContract.addCandidate("John Doe");
    await electoralContract.addVoter("Jane Doe");

    const preResultsCandidate = await electoralContract.getResult();
    expect(preResultsCandidate[0].candidateName).to.equal("John Doe");
    expect(preResultsCandidate[0].voteCount).to.equal(
      ethers.BigNumber.from("0")
    );

    const preResultsVoter = await electoralContract.getVotersDetailed();
    expect(preResultsVoter[0].voterName).to.equal("Jane Doe");
    expect(preResultsVoter[0].hasVoted).to.equal(false);

    await electoralContract.vote(0, 0);

    const postResultsCandidate = await electoralContract.getResult();
    expect(postResultsCandidate[0].candidateName).to.equal("John Doe");
    expect(postResultsCandidate[0].voteCount).to.equal(
      ethers.BigNumber.from("1")
    );

    const postResultsVoter = await electoralContract.getVotersDetailed();
    expect(postResultsVoter[0].voterName).to.equal("Jane Doe");
    expect(postResultsVoter[0].hasVoted).to.equal(true);
  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("ElectoralContract", () => {
  const deployContractFixture = async () => {
    const ElectoralContract = await ethers.getContractFactory(
      "ElectoralContract"
    );
    const electoralContract = await ElectoralContract.deploy([], [], []);
    await electoralContract.deployed();
    return { ElectoralContract, electoralContract };
  };

  it("Should add candidates and voters on deployment", async () => {
    const ElectoralContract = await ethers.getContractFactory(
      "ElectoralContract"
    );
    const electoralContract = await ElectoralContract.deploy(
      ["Tony Stark", "Steve Rogers"],
      ["John Doe", "Jane Doe"],
      ["passwordJohn", "passwordJane"]
    );
    await electoralContract.deployed();
    expect(await electoralContract.getCandidates()).to.eql([
      "Tony Stark",
      "Steve Rogers",
    ]);
    const votersDetailed = await electoralContract.getVotersDetailed();
    expect(votersDetailed[0].voterName).to.equal("John Doe");
    expect(votersDetailed[0].voterPassword).to.equal("passwordJohn");
    expect(votersDetailed[1].voterName).to.equal("Jane Doe");
    expect(votersDetailed[1].voterPassword).to.equal("passwordJane");
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
    await electoralContract.addVoter("Jane Doe", "passwordJane");
    const voters = await electoralContract.getVotersDetailed();
    expect(voters[0].voterName).to.equal("Jane Doe");
    expect(voters[0].voterPassword).to.equal("passwordJane");
  });

  it("Should login and logout", async () => {
    const { electoralContract } = await loadFixture(deployContractFixture);

    await electoralContract.addVoter("Jane Doe", "passwordJane");

    await electoralContract.login(0, "passwordJane");
    await electoralContract.logout(0);
  });

  it("Should cast vote", async () => {
    const { electoralContract } = await loadFixture(deployContractFixture);

    await electoralContract.addCandidate("John Doe");
    await electoralContract.addVoter("Jane Doe", "passwordJane");

    const preResultsCandidate = await electoralContract.getResult();
    expect(preResultsCandidate[0].candidateName).to.equal("John Doe");
    expect(preResultsCandidate[0].voteCount).to.equal(
      ethers.BigNumber.from("0")
    );

    const preResultsVoter = await electoralContract.getVotersDetailed();
    expect(preResultsVoter[0].voterName).to.equal("Jane Doe");
    expect(preResultsVoter[0].hasVoted).to.equal(false);

    await electoralContract.login(0, "passwordJane");
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

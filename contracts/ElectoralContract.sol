//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;

contract ElectoralContract {
    struct Voter {
        string voterName;
        bool hasVoted;
        bool isLoggedIn;
        string voterPassword;
        address nodeAddress;
        uint timestamp;
    }

    struct Candidate {
        string candidateName;
        uint256 voteCount;
    }

    Voter[] private voters;
    string[] private voterNames;
    Candidate[] private candidates;
    string[] private candidateNames;

    constructor(
        string[] memory _candidateNames,
        string[] memory _voterNames,
        string[] memory _password
    ) {
        for (uint256 i = 0; i < _candidateNames.length; i++)
            addCandidate(_candidateNames[i]);
        for (uint256 i = 0; i < _voterNames.length; i++)
            addVoter(_voterNames[i], _password[i]);
    }

    function addCandidate(string memory candidateName) public {
        candidates.push(
            Candidate({candidateName: candidateName, voteCount: 0})
        );
        candidateNames.push(candidateName);
    }

    function addVoter(
        string memory voterName,
        string memory voterPassword
    ) public {
        voters.push(
            Voter({
                voterName: voterName,
                hasVoted: false,
                voterPassword: voterPassword,
                isLoggedIn: false,
                nodeAddress: 0x0000000000000000000000000000000000000000,
                timestamp: 0
            })
        );
        voterNames.push(voterName);
    }

    function login(
        uint256 voterId,
        string memory _password
    ) public returns (bool) {
        require(!voters[voterId].isLoggedIn, "Voter is not logged in");
        require(
            keccak256(abi.encodePacked(voters[voterId].voterPassword)) ==
                keccak256(abi.encodePacked(_password)),
            "Invalid Credentials"
        );
        require(!voters[voterId].hasVoted, "Voter already voted");
        voters[voterId].isLoggedIn = true;
        return voters[voterId].isLoggedIn;
    }

    function logout(uint256 voterId) public {
        require(voters[voterId].isLoggedIn, "Voter is not logged in");
        voters[voterId].isLoggedIn = false;
    }

    function getResult() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoters() public view returns (string[] memory) {
        return voterNames;
    }

    function getCandidates() public view returns (string[] memory) {
        return candidateNames;
    }

    function getVotersDetailed() public view returns (Voter[] memory) {
        return voters;
    }

    function vote(uint256 voterId, uint256 candidateId, uint timestamp) public {
        require(!voters[voterId].hasVoted, "Voter already voted");
        require(voters[voterId].isLoggedIn, "Voter is not logged in");
        candidates[candidateId].voteCount++;
        voters[voterId].hasVoted = true;
        voters[voterId].nodeAddress = msg.sender;
        voters[voterId].timestamp = timestamp;
        logout(voterId);
    }
}

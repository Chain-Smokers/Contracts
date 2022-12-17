//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;

contract ElectoralContract {
    struct Voter {
        uint256 voterId;
        string voterName;
        bool hasVoted;
        bool isLoggedIn;
        string voterPassword;
    }

    struct Candidate {
        string candidateName;
        uint256 voteCount;
    }

    Voter[] private voters;
    string[] private voterNames;
    Candidate[] private candidates;
    string[] private candidateNames;

    constructor(string[] memory _candidateNames, string[] memory _voterNames, string[] memory _password) {
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

    function addVoter(string memory voterName, string memory voterPassword) public {
        voters.push(
            Voter(
                {
                    voterId: voters.length,
                    voterName: voterName, 
                    hasVoted: false,
                    voterPassword: voterPassword,
                    isLoggedIn : false
                    }
                )
            );
        voterNames.push(voterName);
    }

    function login(uint256 voterId,string memory _password) public returns (bool) {
        require(!voters[voterId].isLoggedIn, "User Already Logged In");
        require(keccak256(abi.encodePacked(voters[voterId].voterPassword)) == keccak256(abi.encodePacked(_password)),"Invalid Credentials");
        voters[voterId].isLoggedIn == true;
        return true;
    }

    function logout(uint256 voterId) public {
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

    function vote(uint256 voterId, uint256 candidateId) public {
        require(!voters[voterId].hasVoted);
        require(voters[voterId].isLoggedIn);
        for (uint256 i = 0; i < candidates.length; i++) {
            if (i != candidateId) continue;
            candidates[i].voteCount++;
            voters[voterId].hasVoted = true;
            break;
        }
    }
}

//SPDX-License-Identifier:MIT
pragma solidity ^0.8.17;

contract ElectoralContract {
    struct Voter {
        string voterName;
        bool hasVoted;
    }

    struct Candidate {
        string candidateName;
        uint256 voteCount;
    }

    Voter[] private voters;
    string[] private voterNames;
    Candidate[] private candidates;
    string[] private candidateNames;

    function addCandidate(string memory candidateName) public {
        candidates.push(
            Candidate({candidateName: candidateName, voteCount: 0})
        );
        candidateNames.push(candidateName);
    }

    function addVoter(string memory voterName) public {
        voters.push(Voter({voterName: voterName, hasVoted: false}));
        voterNames.push(voterName);
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

    function vote(uint voterId, uint candidateId) public {
        require(!voters[voterId].hasVoted);
        for (uint i = 0; i < candidates.length; i++) {
            if (i != candidateId) continue;
            candidates[i].voteCount++;
            voters[voterId].hasVoted = true;
            break;
        }
    }
}

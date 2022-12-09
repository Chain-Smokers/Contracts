//SPDX-License-Identifier:MIT
pragma solidity ^0.8;

contract voting{
    struct Voter {
        uint voter_id;
        bytes32 name;
        uint is_voted;

    }

    struct Party {
       uint party_id;
       bytes32 name;
       int vote_count;
    }

    // Voter[] public voters;
    mapping(uint => Voter) public voters;
    Party[] public parties;

    constructor(bytes32[] memory party_names){
        for(uint i = 0; i < party_names.length; i++){
            parties.push(
                Party(
                    {
                        party_id : i,
                        name : party_names[i],
                        vote_count : 0
                    }
                )
            );
        }
    }

    function vote(uint voter_id,uint party_id) public{
        Voter memory voter = voters[voter_id];
        require(voter.is_voted == 0);
        for(uint i = 0; i < parties.length; i++){
            if (parties[i].party_id == party_id) {
                parties[i].vote_count += 1;
                break;
            }
        }
    }

    



}

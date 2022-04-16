// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    struct ElectionInfo {
        string electionName;
        string organizationName;
        bool initialized; // Ensure the election to be initialized only once
    }

    struct ElectionStatus {
        uint256 startTime; // 0 by default (Start right after a election is created)
        uint256 endTime; // 0 by default (Admin can manually end the election)
        bool isTerminated; // true will means an unrevertable termination
    }

    struct Candidate {
        uint256 candidateId;
        string name;
        string description;
        uint256 voteCount;
    }

    struct Voter {
        address voterAddress;
        bool hasVoted;
        bool isVerified;
    }
    
    // Here are all the variables
    address admin; // The creator of this election
    ElectionInfo electionInfo;
    ElectionStatus electionStatus;
    mapping(uint256 => Candidate) candidateSet;
    uint256 candidateNumber;
    mapping(address => Voter) voterSet;
    address[] registeredVoters; // Array of address to store address of voters

    constructor() {
        admin = msg.sender;
        electionInfo = ElectionInfo({
            electionName: "",
            organizationName: "",
            initialized: false
        });
        electionStatus = ElectionStatus({
            startTime: 0,
            endTime: 0,
            isTerminated: false
        });
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier uninitialized {
        require(!electionInfo.initialized);
        _;
    }

    modifier stillAvailable {
        if (electionStatus.startTime != 0){
            require(block.timestamp > electionStatus.startTime);
        }
        if (electionStatus.endTime != 0) {
            if (block.timestamp > electionStatus.endTime) electionStatus.isTerminated = true;
        }
        require(!electionStatus.isTerminated);
        _;
    }

    modifier canVote{
        require(voterSet[msg.sender].hasVoted == false);
        require(voterSet[msg.sender].isVerified == true);
        _;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    function setAdmin(address _admin) public 
    onlyAdmin stillAvailable{
        require(_admin == address(0x0));
        admin = _admin;
    }

    // Initialize and start the election
    function initElection(
        string memory _electionName, 
        string memory _organizationName) public 
    onlyAdmin uninitialized {
        electionInfo = ElectionInfo({
            electionName: _electionName,
            organizationName: _organizationName,
            initialized: true
        });
    }

    // Add new candidates
    function addCandidate(string memory _name, string memory _description) public
    onlyAdmin stillAvailable {
        Candidate memory newCandidate = Candidate({
            candidateId: candidateNumber,
            name: _name,
            description: _description,
            voteCount: 0
        });
        candidateSet[candidateNumber] = newCandidate;
        candidateNumber += 1;
    }

    // End election
    function startElection(
        uint256 _startTime,
        uint256 _endTime) public
    onlyAdmin {
        electionStatus = ElectionStatus({
            startTime: _startTime,
            endTime: _endTime,
            isTerminated: false
        });
    }

    // End election
    function startElectionWithoutDeadline() public
    onlyAdmin {
        electionStatus = ElectionStatus({
            startTime: 0,
            endTime: 0,
            isTerminated: false
        });
    }

    // Register a voter
    function registerVoter() public 
    stillAvailable {
        Voter memory newVoter = Voter({
            voterAddress: msg.sender,
            hasVoted: false,
            isVerified: false
        });
        voterSet[msg.sender] = newVoter;
        registeredVoters.push(msg.sender);
    }

    // Verify a voter
    function verifyVoter(address voterAddress) public 
    onlyAdmin stillAvailable {
        voterSet[voterAddress].isVerified = true;
    }

    // Vote
    function vote(uint256 candidateId) public 
    stillAvailable canVote {
        candidateSet[candidateId].voteCount += 1;
        voterSet[msg.sender].hasVoted = true;
    }

    // End election
    function endElection() public 
    onlyAdmin stillAvailable {
        electionStatus.isTerminated = true;
    }
}

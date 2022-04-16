// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    struct ElectionInfo {
        string electionName;
        string organizationName;
        bool isInitialized; // Ensure the election to be initialized only once
    }

    struct ElectionStatus {
        uint256 startTime; // 0 by default (Start right after a election is created)
        uint256 endTime; // 0 by default (Admin can manually end the election)
        bool isStarted;
        bool isTerminated; // true will means an unrevertable termination
    }

    struct Candidate {
        uint256 id;
        string candidateName;
        string slogan;
        uint256 voteCount;
    }

    struct Voter {
        address voterAddress;
        bool hasVoted;
        bool isVerified;
    }

    event ElectionCreated(string electionName, string organizationName);
    
    event CandidateAdded(uint256 id, string candidateName, string slogan, uint256 voteCount);
    
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
            isInitialized: false
        });
        electionStatus = ElectionStatus({
            startTime: 0,
            endTime: 0,
            isStarted: false,
            isTerminated: false
        });
    }

    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }

    modifier uninitialized {
        require(!electionInfo.isInitialized);
        _;
    }

    modifier notStarted {
        require(!electionStatus.isStarted);
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

    modifier canVote {
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
            isInitialized: true
        });
        emit ElectionCreated(_electionName, _organizationName);
    }

    // Add new candidates
    function addCandidate(string memory _candidateName, string memory _slogan) public
    onlyAdmin notStarted {
        Candidate memory newCandidate = Candidate({
            id: candidateNumber,
            candidateName: _candidateName,
            slogan: _slogan,
            voteCount: 0
        });
        candidateSet[candidateNumber] = newCandidate;
        emit CandidateAdded(candidateNumber, _candidateName, _slogan, 0);
        candidateNumber += 1;
    }

    // End election
    function startElection(
        uint256 _startTime,
        uint256 _endTime) public
    onlyAdmin notStarted {
        electionStatus = ElectionStatus({
            startTime: _startTime,
            endTime: _endTime,
            isStarted: true,
            isTerminated: false
        });
    }

    // End election
    function startElectionWithoutDeadline() public
    onlyAdmin notStarted {
        electionStatus = ElectionStatus({
            startTime: 0,
            endTime: 0,
            isStarted: true,
            isTerminated: false
        });
    }

    function getElectionInfo() public view returns (string memory, string memory, bool) {
        return (electionInfo.electionName, electionInfo.organizationName, electionInfo.isInitialized);
    }

    function getElectionStatus() public view returns (uint256, uint256, bool) {
        return (electionStatus.startTime, electionStatus.endTime, electionStatus.isTerminated);
    }

    function getAllCandidates() 
    public view returns (uint256[] memory, string[] memory, string[] memory, uint256[] memory) {
        uint256[] memory id = new uint256[](candidateNumber);
        string[] memory candidateName = new string[](candidateNumber);
        string[] memory  slogan = new string[](candidateNumber);
        uint256[] memory voteCount = new uint256[](candidateNumber);
        for (uint i = 0; i < candidateNumber; i++) {
            id[i] = candidateSet[i].id;
            candidateName[i] = candidateSet[i].candidateName;
            slogan[i] = candidateSet[i].slogan;
            voteCount[i] = candidateSet[i].voteCount;
        }
        return (id, candidateName, slogan, voteCount);
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
    function vote(uint256 id) public 
    stillAvailable canVote {
        candidateSet[id].voteCount += 1;
        voterSet[msg.sender].hasVoted = true;
    }

    // End election
    function endElection() public 
    onlyAdmin stillAvailable {
        electionStatus.isTerminated = true;
    }
}

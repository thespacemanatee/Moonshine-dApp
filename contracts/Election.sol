// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    address admin;
    string electionName;
    uint256 startTime;
    uint256 endTime;
    // string[] options;
    uint256 candidateCount;
    bool allowMultipleOption;
    bool stopOnTime;
    bool inProgress;

    constructor() {
        admin = msg.sender;
        electionName = "";
        startTime = 0;
        endTime = 0;
        // options = [];
        allowMultipleOption = false;
        stopOnTime = true;
        inProgress = false;
    }

    struct Candidate {
        uint256 candidateId;
        string name;
        string description;
        uint256 voteCount;
    }
    
    mapping(uint256 => Candidate) public candidateSet;

    struct Voter {
        address voterAddress;
        bool hasVoted;
        bool isVerified;
    }
    
    address[] public registeredVoters; // Array of address to store address of voters
    mapping(address => Voter) public voterSet;

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    //Getters and Setters
    function getAdmin() public view returns (address) {
        return admin;
    }

    function setAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin == address(0x0));
        admin = _newAdmin;
    }

    function getElectionName() public view returns (string memory) {
        return electionName;
    }

    function setElectionName(string memory newElectionName) public onlyAdmin {
        electionName = newElectionName;
    }

    function getStartTime() public view returns (uint256) {
        return startTime;
    }

    function setStartTime(uint256 newStartTime) public onlyAdmin {
        startTime = newStartTime;
    }

    function getEndTime() public view returns (uint256) {
        return endTime;
    }

    function setEndTime(uint256 newEndTime) public onlyAdmin {
        endTime = newEndTime;
    }

    function getParticipantCount() public view returns (uint256) {
        return registeredVoters.length;
    }

    function getAllowMultipleOption() public view returns (uint) {
        return startTime;
    }

    function setAllowMultipleOption(bool newAllowMultipleOption) public
    onlyAdmin
    {
        allowMultipleOption = newAllowMultipleOption;
    }

    function getStopOnTime() public view returns (bool) {
        return stopOnTime;
    }

    function setStopOnTime(bool newStopOnTime) public onlyAdmin {
        stopOnTime = newStopOnTime;
    }

    // Adding new candidates
    function addCandidate(string memory _name, string memory _description) public
    onlyAdmin
    {
        Candidate memory newCandidate =
            Candidate({
                candidateId: candidateCount,
                name: _name,
                description: _description,
                voteCount: 0
            });
        candidateSet[candidateCount] = newCandidate;
        candidateCount += 1;
    }
    
    // Register a voter
    function registerVoter() public  {
        Voter memory newVoter =
            Voter({
                voterAddress: msg.sender,
                hasVoted: false,
                isVerified: false
            });
        registeredVoters.push(msg.sender);
        voterSet[msg.sender] = newVoter;
    }

    // Verify a voter
    function verifyVoter(address voterAddress) public onlyAdmin
    {
        voterSet[voterAddress].isVerified = true;
    }
    
    // Vote
    function vote(uint256 candidateId) public {
        require(voterSet[msg.sender].hasVoted == false);
        require(voterSet[msg.sender].isVerified == true);
        require(inProgress == true);
        candidateSet[candidateId].voteCount += 1;
        voterSet[msg.sender].hasVoted = true;
    }

    function startElection() public onlyAdmin {
        require(inProgress == false);
        inProgress = true;
    }

    // End election
    function endElection() public onlyAdmin {
        require(inProgress == true);
        inProgress = false;
    }
}

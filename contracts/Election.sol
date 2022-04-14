// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    address admin;
    string electionName;
    uint256 electionId;
    uint256 startTime;
    uint256 endTime;
    // string[] options;
    uint256 participantCount;
    uint256 candidateCount;
    bool allowMultipleOption;
    bool stopOnTime;
    bool start;
    bool end;

    constructor() public {
        admin = msg.sender;
        electionName = "";
        electionId = 0;
        startTime = 0;
        endTime = 0;
        // options = [];
        participantCount = 0;
        allowMultipleOption = false;
        stopOnTime = true;
        start = true;
        end = false;
    }

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

    function getElectionId() public view returns (uint256) {
        return electionId;
    }

    function setElectionId(uint256 newElectionId) public onlyAdmin {
        electionId = newElectionId;
    }

    function getStartTime() public view returns (uint256) {
        return startTime;
    }

    function setStartTime(uint256 NewstartTime) public onlyAdmin {
        startTime = NewstartTime;
    }

    function getEndTime() public view returns (uint256) {
        return endTime;
    }

    function setEndTime(uint256 NewendTime) public onlyAdmin {
        endTime = NewendTime;
    }

    function getParticipantCount() public view returns (uint256) {
        return participantCount;
    }

    function setParticipantCount(uint256 NewparticipantNum) public onlyAdmin {
        participantCount = NewparticipantNum;
    }

    function getAllowMultipleOption() public view returns (uint) {
        return startTime;
    }

    function setAllowMultipleOption(bool NewAllowMultipleOption) public
    onlyAdmin
    {
        allowMultipleOption = NewAllowMultipleOption;
    }

    function getStopOnTime() public view returns (bool) {
        return stopOnTime;
    }

    function setStopOnTime(bool NewstopOnTime) public onlyAdmin {
        stopOnTime = NewstopOnTime;
    }

    struct Candidate {
        uint256 candidateId;
        string name;
        string description;
        uint256 voteCount;
    }
    mapping(uint256 => Candidate) public candidateSet;

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

    struct Voter {
        address voterAddress;
        bool hasVoted;
        bool isRegistered;
    }
    address[] public RegisteredVoters; // Array of address to store address of voters
    mapping(address => Voter) public voterSet;
    
    //register a voter
    function registerAsVoter(string memory _name, string memory _phone) public {
        Voter memory newVoter =
            Voter({
                voterAddress: msg.sender,
                hasVoted: false,
                isRegistered: true
            });
        voterSet[msg.sender] = newVoter;
        RegisteredVoters.push(msg.sender);
        participantCount += 1;
    }

    // Vote
    function vote(uint256 candidateId) public {
        require(voterSet[msg.sender].hasVoted == false);
        require(voterSet[msg.sender].isRegistered == true);
        require(start == true);
        require(end == false);
        candidateSet[candidateId].voteCount += 1;
        voterSet[msg.sender].hasVoted = true;
    }

    // End election
    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

}

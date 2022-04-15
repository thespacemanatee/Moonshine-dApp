// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    struct ElectionInfo {
        string electionName;
        uint256 electionId; // Can set the creation time of election as Id.
        uint256 startTime;  //-1 by default (Start right after a election is created)
        uint256 endTime;    //-1 by default (Admin can manually end the election)
        bool start;
        bool end;
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
        bool isRegistered;
        bool isVerified;
    }
    //Here are all the variables
    address admin; //The creator of this election
    ElectionInfo electionInfo;
    mapping(uint256 => Candidate) public candidateSet;
    mapping(address => Voter) public voterSet;
    constructor() public {
        admin = msg.sender;
        electionInfo = ("", block.timestamp, -1, -1, true, false);
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

    address[] public RegisteredVoters; // Array of address to store address of voters
    
    //register a voter
    function registerVoter() public  {
        Voter memory newVoter =
            Voter({
                voterAddress: msg.sender,
                hasVoted: false,
                isRegistered: true,
                isVerified: false
            });
        voterSet[msg.sender] = newVoter;
        RegisteredVoters.push(msg.sender);
        participantCount += 1;
    }

    // Verify a voter
    function verifyVoter(address voterAddress) public 
    onlyAdmin
    {
        voterSet[voterAddress].isVerified = true;
    }
    
    // Vote
    function vote(uint256 candidateId) public {
        require(voterSet[msg.sender].hasVoted == false);
        require(voterSet[msg.sender].isRegistered == true);
        require(voterSet[msg.sender].isVerified == true);
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

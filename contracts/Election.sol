// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
    address admin;
    string electionName;
    uint256 electionId;
    uint256 startTime;
    uint256 endTime;
    // string[] options;
    uint256 participantNum;
    uint256 candidateCount;
    bool allowMultipleOption;
    bool stopOnTime;

    constructor() public {
        admin = msg.sender;
        electionName = "";
        electionId = 0;
        startTime = 0;
        endTime = 0;
        // options = [];
        participantNum = 0;
        allowMultipleOption = false;
        stopOnTime = true;
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

    function getParticipantNum() public view returns (uint256) {
        return participantNum;
    }

    function setParticipantNum(uint256 NewparticipantNum) public onlyAdmin {
        participantNum = NewparticipantNum;
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

    
}

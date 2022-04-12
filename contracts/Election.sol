// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
  address admin;
  string electionName;
  uint electionId;
  uint startTime;
  uint endTime;
  // string[] options;
  uint participantNum;
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

  modifier onlyAdmin{
    require(msg.sender == admin);
    _;
  }

  function getAdmin() public view returns (address){
    return admin;
  }

  function setAdmin(address _newAdmin) public
  onlyAdmin
  {
    require(_newAdmin == address(0x0));
    admin = _newAdmin;
  }

  function getElectionName() public view returns (string memory){
    return electionName;
  }

  function setElectionName(string memory newElectionName) public onlyAdmin{
    electionName = newElectionName;
  }

  function getElectionId() public view returns (uint){
    return electionId;
  }

  function setElectionId(uint newElectionId) public onlyAdmin{
    electionId = newElectionId;
  }

  struct Candidate{
    uint id;
    uint token;

  }
}

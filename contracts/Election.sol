// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Election {
  address admin;
  string electionName;
  string electionId;
  uint256 startTime;
  uint256 endTime;
  string[] options;
  uint256 participantNum;
  bool allowMultipleOption;
  bool stopOnTime;

  constructor() public {
    admin = msg.sender;
  }

  modifier onlyAdmin{
    require(msg.sender == admin);
    _;
  }

  function getAdmin() public view returns (address){
    return admin;
  }

  function handOverAdmin(address _newAdmin) public
  onlyAdmin
  {
    require(_newAdmin == address(0x0));
    admin = _newAdmin;
  }
}

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
    if (msg.sender != admin) throw;
    _;
  }

  function getAdmin() public view returns (address){
    return admin;
  }

  function handOverAdmin(address _newAdmin)
  onlyAdmin
  {
    if(_newAdmin == 0x0) throw;
    admin = _newAdmin;
  }
}

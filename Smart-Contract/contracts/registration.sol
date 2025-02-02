// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract ClassRegistrationSystem {
    struct Student {
        string name;
        uint256 studentId;
    }
    
    address public admin;
    mapping(uint256 => Student) private students;
    uint256[] private studentIds;
    
    event StudentRegistered(uint256 indexed studentId, string name);
    event StudentRemoved(uint256 indexed studentId);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function registerStudent(uint256 _studentId, string memory _name) public onlyAdmin {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(students[_studentId].studentId == 0, "Student already registered");
        
        students[_studentId] = Student(_name, _studentId);
        studentIds.push(_studentId);
        
        emit StudentRegistered(_studentId, _name);
    }
    
    function removeStudent(uint256 _studentId) public onlyAdmin {
        require(students[_studentId].studentId != 0, "Student not registered");
        
        delete students[_studentId];
        
        for (uint i = 0; i < studentIds.length; i++) {
            if (studentIds[i] == _studentId) {
                studentIds[i] = studentIds[studentIds.length - 1];
                studentIds.pop();
                break;
            }
        }
        
        emit StudentRemoved(_studentId);
    }
    
    function getStudent(uint256 _studentId) public view returns (string memory, uint256) {
        require(students[_studentId].studentId != 0, "Student not registered");
        return (students[_studentId].name, students[_studentId].studentId);
    }
    
    function getAllStudents() public view returns (Student[] memory) {
        Student[] memory allStudents = new Student[](studentIds.length);
        for (uint i = 0; i < studentIds.length; i++) {
            allStudents[i] = students[studentIds[i]];
        }
        return allStudents;
    }
}

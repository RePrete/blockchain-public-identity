pragma solidity ^0.5.0;

contract UserList {
    struct User {
        string firstName;
        string lastName;
        string email;
    }

    event UserCreated(
        string firstName,
        string lastName,
        string indexed email,
        address indexed publicKey
    );

    mapping(address => User) public users;

    function createUser(
        address publicKey,
        string memory firstName,
        string memory lastName,
        string memory email
    ) public {
        users[publicKey] = User(firstName, lastName, email);
        emit UserCreated(firstName, lastName, email, publicKey);
    }
}

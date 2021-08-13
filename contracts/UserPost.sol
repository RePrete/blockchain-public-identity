pragma solidity ^0.5.0;

contract UserPost {
    struct User {
        uint32 postCount;
        string firstName;
        string lastName;
        string email;
    }

    struct Post {
        string content;
        uint32 timestamp;
    }
    
    mapping(address => User) public users;
    mapping(address => uint32) public postCounts;
    mapping(address => mapping(uint32 => Post)) public posts;

    function createUser(
        string calldata firstName,
        string calldata lastName,
        string calldata email
    ) external {
        users[msg.sender] = User({
            postCount: 0,
            firstName: firstName, 
            lastName: lastName, 
            email: email
        });
    }

    function createPost(string calldata content, uint32 timestamp) external {
        address a = msg.sender;
        posts[a][postCounts[a]] = Post(content, timestamp);
        postCounts[a]++;
    }
}

pragma solidity ^0.5.0;

contract PostList {

    struct Post {
        uint id;
        string content;
    }
    
    event PostCreated(
        uint id,
        string content,
        address indexed from
    );

    uint public postCount = 0;
    mapping(uint => Post) public posts;

    function createPost(string memory content, address from) public {
        posts[postCount] = Post(postCount, content);
        emit PostCreated(postCount, content, from);
        postCount++;
    }
}

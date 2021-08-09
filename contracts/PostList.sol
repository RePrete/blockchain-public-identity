pragma solidity ^0.5.0;

contract PostList {

    struct Post {
        uint id;
        string content;
    }

    uint public postCount = 0;
    mapping(uint => Post) public posts;

    function createPost(string memory _content) public {
        posts[postCount] = Post(postCount, _content);
        postCount++;
    }
}

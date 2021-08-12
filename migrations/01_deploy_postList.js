var PostList = artifacts.require("./PostList.sol");

module.exports = function(deployer) {
  deployer.deploy(PostList);
};
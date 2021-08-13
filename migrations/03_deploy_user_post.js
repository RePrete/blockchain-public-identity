var UserPost = artifacts.require("./UserPost.sol");

module.exports = async function (deployer) {
    await deployer.deploy(UserPost);
    const instance = await UserPost.deployed();
};
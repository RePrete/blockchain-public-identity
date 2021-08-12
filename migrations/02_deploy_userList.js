var UserList = artifacts.require("./UserList.sol");

module.exports = async function(deployer) {
  await deployer.deploy(UserList);
  const instance = await UserList.deployed();
  await instance.createUser("0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1", "Raffaele", "Del Prete", "raffo002@gmail.com");
  await instance.createUser("0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", "Elon", "Musk", "eliamosca@email.com");
};
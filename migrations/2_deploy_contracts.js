var Greeter = artifacts.require("./Greeter.sol");
var SharedAccount = artifacts.require('./SharedAccount.sol')

module.exports = function(deployer) {
  deployer.deploy(Greeter);
  deployer.deploy(SharedAccount);
};

var Contract = artifacts.require("./Greeting.sol"); 
module.exports = function( deployer) { 
  deployer.deploy( Contract); 
};
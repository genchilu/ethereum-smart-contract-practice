var Crowdfund = artifacts.require("./Crowdfund.sol"); 

module.exports = function(deployer, accounts) {
    var verifier = accounts[0];
    var receiver = accounts[1];
    deployer.deploy(Crowdfund, "0x627306090abab3a6e1400e9345bc60c78a8bef57", "0xf17f52151ebef6c7334fad080c5704d77216b732");
}

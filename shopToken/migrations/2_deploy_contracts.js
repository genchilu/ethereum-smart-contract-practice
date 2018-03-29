var ShopToken = artifacts.require("./ShopToken.sol");
var ShopTokenICO = artifacts.require("./ShopTokenICO.sol");

module.exports = function(deployer, accounts) {
    var totalShopTokens = web3.toWei(10000, "ether");
    var tokensPerEther = 100;
    var maxFunding = web3.toWei(10, "ether");
    var fundingGoal = web3.toWei(5, "ether");
    var now = new Date();
    var deadline = new Date().setDate(now.getDate() + 10);
    var owner = accounts[0];
    let contractOwner = accounts[0];

    deployer.deploy(ShopToken, totalShopTokens).then(function() {
        console.log("Address for ShopToken:" + ShopToken.address);
        return deployer.deploy(
            ShopTokenICO,
            ShopToken.address,
            tokensPerEther,
            maxFunding,
            fundingGoal,
            deadline
        ).then(function(){
            console.log("Address for ShopTokenICO:" + ShopTokenICO.address);
        });
    });
}

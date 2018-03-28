var ShopToken = artifacts.require("./ShopToken.sol");
var ShopTokenICO = artifacts.require("./ShopTokenICO.sol");
module.exports = function(deployer) {
    deployer.deploy(ShopToken, "1000000000000").then(function() {
        console.log("Address for ShopToken:" + ShopToken.address);
        return deployer.deploy(
            ShopTokenICO,
            ShopToken.address,
            100,
            "10",
            "5",
            "1539475200"
        ).then(function(){
            console.log("Address for ShopTokenICO:" + ShopTokenICO.address);
        });
    });
}

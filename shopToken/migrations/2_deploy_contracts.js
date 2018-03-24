var ShopToken = artifacts.require("./ShopToken.sol");
var ShopTokenICO = artifacts.require("./ShopTokenICO.sol");
module.exports = function( deployer) {
    deployer.deploy( ShopToken, "1000000000000000000").then( function() {
        return deployer.deploy( ShopTokenICO, ShopToken.address, 100, "500000000000000000000", "300000000000000000000", "1539475200");
    });
}

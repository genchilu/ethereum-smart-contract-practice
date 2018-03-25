const ShopToken = artifacts.require("ShopToken");

contract("ShopToken", (accounts) => {
    let contractOwner = accounts[0];
    let buyer = accounts[1];

     it(" should fire Transfer event when transfer is called", async () => {
         let shopToken = await ShopToken.new("10000");
         let tx = await shopToken.transfer(buyer, "100", { from: contractOwner });
         assert.equal( tx.logs.length, 1, "Expected one event to be fired");
         let log = tx.logs[0];
         assert.equal( log.event, "Transfer", "Transfer event was not fired");
         assert.equal( log.args._from, contractOwner, "_from argument is not set correctly");
         assert.equal( log.args._to, buyer, "_to argument is not set correctly");
         assert.equal( log.args._value, 100, "_value arugment is not set correctly");
    });
});

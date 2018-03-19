const ShopToken = artifacts.require("ShopToken");
let contractOwner = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
let buyer = "0xf17f52151ebef6c7334fad080c5704d77216b732";
contract("ShopToken", (accounts) => {
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

var expectVerifier = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
var expectReceiver = "0xf17f52151ebef6c7334fad080c5704d77216b732";
var funder = "0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef";
var expectFund = web3.toWei(1, "ether");

var Crowdfund = artifacts.require("Crowdfund"); 

contract("Crowdfund", function (accounts) {
    var crowdfund; 
    before( async function () { 
        crowdfund = await Crowdfund.deployed();
    });

    it("should have verifier set correctly", async function () { 
        var verifier = await crowdfund.verifier();
        assert.equal(expectVerifier, verifier, "The verifier account did not set correctly.");
    });

    it("should have receiver set correctly", async function () {
        var receiver = await crowdfund.receiver();
        assert.equal(expectReceiver, receiver, "The receiver account did not set correctly.");
    });

    it("should keep track of funds", async function(){
        await crowdfund.fund({
            from: funder,
            value: expectFund
        });
        var fund = await crowdfund.funds(funder);
        assert.equal(expectFund, fund, "This contract did not keep track of funds properly.");
    });
});
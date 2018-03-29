const ShopToken = artifacts.require("ShopToken");
const ShopTokenICO = artifacts.require("ShopTokenICO");

contract("ShopTokenICO", (accounts) => {
    var totalShopTokens = web3.toWei(10000, "ether");
    var tokensPerEther = 100;
    var maxFunding = web3.toWei(10, "ether");
    var fundingGoal = web3.toWei(5, "ether");
    var now = new Date();
    var deadline = new Date().setDate(now.getDate() + 10);
    var owner = accounts[0];
    let contractOwner = accounts[0];
    let buyer = accounts[1];

    let shopToken;
    let shopTokenICO;
    beforeEach( async () => {
        shopToken = await ShopToken.new(totalShopTokens);
        shopTokenICO = await ShopTokenICO.new(
            shopToken.address,
            tokensPerEther,
            maxFunding,
            fundingGoal,
            deadline
        );

        shopToken.transfer(shopTokenICO.address, totalShopTokens);
    });

    it(" could buy after begin", async () => {
        shopTokenICO.begin();
        await shopTokenICO.buy(buyer, {from: buyer, value: web3.toWei(1, "ether")});
    });
});

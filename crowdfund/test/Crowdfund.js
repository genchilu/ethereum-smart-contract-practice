var Crowdfund = artifacts.require("Crowdfund");

let getBalance = (account) => {
    return new Promise( (resolve, error) => {
        web3.eth.getBalance(account, (err, balance) => {
            if (err) {
                error( err);
            } else {
                resolve( balance);
            }
        });
    }); 
};

contract("Crowdfund", (accounts) => {
    var expectVerifier = accounts[0];
    var expectReceiver = accounts[1];
    var funder = accounts[2];
    var expectFund = web3.toWei(1, "ether");

    let crowdfund;

    beforeEach(async () => {
        crowdfund = await Crowdfund.new(expectVerifier, expectReceiver);
    });

    it(" should have verifier set correctly", async () => {
        let verifier = await crowdfund.verifier();
        assert.equal(expectVerifier, verifier, "The verifier account did not set correctly.");
    });

    it(" should have receiver set correctly", async () => {
        let receiver = await crowdfund.receiver();
        assert.equal(expectReceiver, receiver, "The receiver account did not set correctly.");
    });

    it(" should keep track of funds", async () => {
        await crowdfund.fund({
            from: funder,
            value: expectFund
        });
        let fund = await crowdfund.funds(funder);
        assert.equal(expectFund, fund, "This contract did not keep track of funds properly.");
    });

    it(" should release funds during approval", async () => {
        let initialReceiverBalance = await getBalance(expectReceiver);
        let initialContractBalance = await getBalance(crowdfund.address);

        await crowdfund.approve( true, { from: expectVerifier});
        let finalReceiverBalance = await getBalance(expectReceiver);
        let finalContractBalance = await getBalance(crowdfund.address);

        assert.equal(
            finalContractBalance.valueOf(),
            0, 
            "The full balance of the contract was not transferred"
        );
 
        assert.equal(
            finalReceiverBalance.minus(initialReceiverBalance).valueOf(),
            initialContractBalance.valueOf(),
            "The receiver did not receive the funds from the contract");
    });

    it(" should prevent random accounts from calling approve", async () => {
        try {
            await crowdfund.approve( true, { from: expectReceiver});
        } catch (error) {
            assert(true, "Expected exception" );
            return;
        }
        assert( false, "Expected throw not received");
    });
});
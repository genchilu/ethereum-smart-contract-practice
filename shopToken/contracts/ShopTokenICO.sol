pragma solidity ^ 0.4.17;
import "./ERC20.sol";

contract ShopTokenICO {
    ERC20 public shopToken;
    address public owner;
    uint public maxFunding;
    uint public deadline;
    uint public fundingGoal;
    uint public tokensPerEther;
    bool public withdrawalAllowed;
    bool public refundingAllowed;
    bool public started;

    modifier ensureStarted() {
        require( started); _;
    }

    modifier onlyOwner() {
        require( msg.sender == owner);
        _;
    }

    modifier afterDeadline() {
        require( deadline < now);
        _;
    }

    modifier beforeDeadline() {
        require( deadline >= now);
        _;
    }

    modifier ensureRefundingAllowed() {
        require( refundingAllowed);
        _;
    }

    modifier ensureWithdrawalAllowed() {
        require( withdrawalAllowed);
        _;
    }

    function ShopTokenICO( address _shopToken, uint _price, uint _maxFunding, uint _fundingGoal, uint _deadline) {
        shopToken = ERC20(_shopToken);
        tokensPerEther = _price;
        maxFunding = _maxFunding;
        fundingGoal = _fundingGoal;
        deadline = _deadline;
        owner = msg.sender;
    }

    function begin() onlyOwner {
        require( shopToken.balanceOf( this) >= (maxFunding * tokensPerEther)/( 1 ether));
        started = true;
    } 
    function buy( address tokensReceiver) payable ensureStarted beforeDeadline {
        uint tokensBought = (msg.value * tokensPerEther)/( 1 ether);
        require( maxFunding >= msg.value + this.balance);
        require( shopToken.transfer( tokensReceiver, tokensBought));
    }

    function withdraw( address receiver) onlyOwner ensureWithdrawalAllowed {
        receiver.transfer( this.balance);
    }

    function sell( address receiver, uint value) ensureRefundingAllowed {
        require( shopToken.transferFrom( msg.sender, owner, value));
        receiver.transfer(( value * 1 ether)/ tokensPerEther);
    }

    function end() afterDeadline {
        if( this.balance >= fundingGoal) {
            withdrawalAllowed = true;
        } else {
            refundingAllowed = true;
        }
    }

    function getTokensLeft() constant returns (uint) {
        return shopToken.balanceOf( this);
    }

    function() payable {
        buy( msg.sender);
    }
}
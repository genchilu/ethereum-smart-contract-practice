pragma solidity ^ 0.4.17; 
contract Crowdfund { 
    bool public over; 
    bool public refunded; 
    bool public funded; 
    address public verifier; 
    address public receiver; 
    address[] public funders;
    mapping (address => uint) public funds;

    modifier onlyVerifier() { 
        require( msg.sender == verifier); 
        _; 
    }

    modifier isNotOver() { 
        require(!over);
         _; 
    }

    function Crowdfund( address _verifier, address _receiver) { 
        verifier = _verifier;
        receiver = _receiver; 
    }
    
    function fund() payable isNotOver { 
        require( msg.value != 0); 
        if(funds[msg.sender] == 0){ 
            funders.push( msg.sender); 
        } 
        funds[msg.sender] += msg.value; 
    } 
    
    function release() { 
        funded = true; 
        receiver.transfer(this.balance); 
    }

    function refund() { 
        refunded = true; 
        for(uint i = 0; i < funders.length; i++) {
            address funder = funders[ i]; 
            funder.send( funds[ funder]); 
        }
    }
    
    function approve(bool completed) onlyVerifier isNotOver {
        over = true;
        if(completed) {
            release();
        } else {
            refund(); 
        }
    }
}
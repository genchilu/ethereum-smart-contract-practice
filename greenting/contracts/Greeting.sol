pragma solidity ^ 0.4.17;
contract Greeting {
    string message;
    address public owner;

    function Greeting() {
        owner = msg.sender;
    }

    function setMessage( string _message) {
        message = _message;
    }

    function getMessage() constant returns (string) {
        return message;
    }
}

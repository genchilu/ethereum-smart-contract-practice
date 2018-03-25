pragma solidity ^ 0.4.17;

import "./ERC20.sol"; 

contract ShopToken is ERC20 {
    uint totalShopTokens;
    mapping (address => uint) ledger;
    mapping (address => mapping (address => uint)) allowances;
    string public name = "Shop Token";
    string public symbol = "SHT";
    uint8 public decimals = 18;

    function ShopToken(uint _totalShopTokens) {
        ledger[msg.sender] = _totalShopTokens;
        totalShopTokens = _totalShopTokens;
    }

    function balanceOf(address _owner) constant returns (uint) {
        return ledger[_owner];
    }

    function transfer(address _to, uint _value) returns (bool) {
        if( ledger[msg.sender] >= _value && _value > 0) {
            ledger[msg.sender] -= _value;
            ledger[_to] += _value;
            Transfer(msg.sender, _to, _value);
            return true;
        } else{
            return false;
        }
    }

    function approve(address _spender, uint _value) returns (bool) {
        allowances[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) returns (bool) {
        if( allowances[_from][msg.sender] >= _value && _value > 0 && ledger[_from] >= _value) {
            ledger[_from] -= _value;
            ledger[_to] += _value;
            allowances[_from][msg.sender] -= _value;
            Transfer(_from, _to, _value);
            return true;
        } else {
            return false;
        }
    }

    function allowance(address _owner, address _spender) constant returns (uint) {
        return allowances[_owner][_spender];
    }

    function totalSupply() constant returns (uint) {
        return totalShopTokens;
    }
}


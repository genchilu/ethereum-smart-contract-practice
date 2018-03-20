import "../stylesheets/app.css";

import {
  default as Web3
} from 'web3'; 

import {
  default as contract
} from 'truffle-contract';

import shopTokenArtifacts from '../../build/contracts/shopToken.json'; 
import shopTokenICOArtifacts from '../../build/contracts/shopTokenICO.json';

var ShopToken = contract(shopTokenArtifacts);
var ShopTokenICO = contract(shopTokenICOArtifacts);
var accounts;

window.App = { 
  start: function () {
    ShopToken.setProvider(web3.currentProvider);
    ShopTokenICO.setProvider( web3. currentProvider);
    web3.eth.getAccounts(function (err, accs) { 
      console.log( accs);
      if (err != null) { 
        alert(" There was an error fetching your accounts."); 
        return; 
      } if (accs.length == 0) { 
        alert(" Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      } 
      accounts = accs; 
      ShopToken.deployed().then(function (instance) { 
        shopToken = instance; return ShopTokenICO.deployed(); 
      }).then( function (instance) {
        shopTokenICO = instance; App.refreshBalance();
        return shopTokenICO.deadline();
      }).then( function (deadline) { 
        var currentTime = Math.floor( Date.now() / 1000);
        if (currentTime < deadline.toNumber()) { 
          return "funding"; 
        } else { 
          return shopTokenICO.refundingAllowed(); 
        }
      }).then( function (refundingAllowed) { 
        if (refundingAllowed == "funding") { 
          $(".funding").show(); 
        } else if (refundingAllowed) {
          $(".refund").show();
        } else { 
          $(".success").show(); 
        } 
      });
    });
  },
  refreshBalance: function () { 
    ShopToken.deployed().then( function (shopToken) { 
      return shopToken.balanceOf( accounts[ 0]); 
    }).then( function (balance) { 
      $("#shop-token-balance").
      html( balance.valueOf());
    });
    ShopTokenICO.deployed().then( function (shopTokenICO) { 
      return shopTokenICO.getTokensLeft(); 
    }).then(function (balance) { 
      $("#ico-shop-token-balance").html( balance.valueOf()); 
    }); 
  } 
};


window.addEventListener('load', function () { 
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http:// truffleframework.com/ tutorials/ truffle-and-metamask");
    window.web3 = new Web3( new Web3. providers.HttpProvider(" http://localhost:9545"));
  }
  App.start();
});

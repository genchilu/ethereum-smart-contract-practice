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
var accounts, shopToken, shopTokenICO, shopTokenBalance;

var ShopTokenAddress = "0xadad017f2ff19b2fb69fae94022d1098de36c353";
var ShopTokenICOAddress = "0x2b5328bfda98c7a3c1728c53943c06cc215c7030";

window.App = {
  start: function () {
    ShopToken.setProvider(web3.currentProvider);
    ShopTokenICO.setProvider(web3.currentProvider);
    web3.eth.getAccounts( function (err, accs) {
      console.log( accs);
      if (err != null) {
        alert(" There was an error fetching your accounts.");
        return;
      } 
      if (accs.length == 0) { 
        alert(" Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      accounts = accs;
      ShopToken.at(ShopTokenAddress).then(function (instance) {
        shopToken = instance;
        return ShopTokenICO.at(ShopTokenICOAddress);
      }).then(function (instance) {
        shopTokenICO = instance;
        var transfers = shopToken.Transfer();
        transfers.watch(function (err, event) {
          if (err) return;
          if( event.args._from == shopTokenICO.address || event.args._to == shopTokenICO.address || event.args._from == accounts[ 0] || event.args._to == accounts[ 0]) {
            App.refreshBalance();
          }
        });
        App.refreshBalance();
        return shopTokenICO.deadline();
      }).then( function (deadline) {
        var currentTime = Math.floor( Date.now()/1000);
        if (currentTime < deadline.toNumber()) {
          return "funding";
        } else {
          return shopTokenICO.refundingAllowed();
        }
      }).then(function (refundingAllowed) {
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
    console.log('refresh balance');
    shopToken.balanceOf(accounts[0]).then(function (balance) {
      console.log('shop-token-balance');
      console.log(balance.valueOf());
      $("#shop-token-balance").html(balance.valueOf());
    }); 
    shopToken.totalSupply().then(function (totalSupply) {
      console.log('total supply');
      console.log(totalSupply);
    })
    shopTokenICO.getTokensLeft().then(function (balance) {
      console.log('ico-shop-token-balance');
      $("#ico-shop-token-balance").html( balance.valueOf());
    });
  },

  buy: function () {
    var amount = parseInt($("#amount").val());
    var receiver = $("#send-token-address").val();
    if (receiver.trim() == "") {
      receiver = accounts[0];
    } if (amount <= 0) {
      alert(" You must buy at least 1 Shop Token");
      return;
    }
    console.log("I wanna buy");
    console.log(amount/100);
    var value = web3.toWei(amount/100, "ether");
    shopTokenICO
      .buy(receiver, { value: value, from: accounts[0]})
      .catch(function (error) {
        alert(error); 
      }
    ).then(App.refreshBalance);
  },

  approve: function() { 
    shopToken.approve(shopTokenICO.address, shopTokenBalance, { from: accounts[0]}).then( function (transaction) {
      if(transaction.logs.length > 0) { 
        $(".approve").hide();
        $(".sell").show();
      } else {
        throw new Error(" Could not approve transfer to ShopTokenICO");
      }
    }).catch(alert).then(App.refreshBalance);
  },

  refund: function () {
    var receiver = $("#refund-address").val();
    if (receiver.trim() == "") {
      receiver = accounts[0];
    }
    shopTokenICO.sell(
      receiver,
      shopTokenBalance,
      { from: accounts[0] }
    ).catch(alert).then(App.refreshBalance);
  }
};

window.addEventListener('load', function () {
  if (typeof web3 !== 'undefined') {
    console.log('hio');
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn(" No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.web3 = new Web3( new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  App.start();
});


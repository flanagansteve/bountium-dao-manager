// TODO add a order-status-checker given an orderID
// TODO tell customer the orderID once tx goes through
// TODO add more details to display in customer view of store:
  // product descript
  // image for product
  // info about how it is being assured for delivery (ie, guarantees)
  // info about store - their history, reviews, etc
    // TODO can do this via product overviews - just don't include product mod btns

var autobizABI = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"owners","outputs":[{"name":"name","type":"string"},{"name":"stake","type":"uint256"},{"name":"callsDividend","type":"bool"},{"name":"canDilute","type":"bool"},{"name":"canBestow","type":"bool"},{"name":"canModifyCatalogue","type":"bool"},{"name":"board","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"product","type":"uint256"},{"name":"orderID","type":"uint256"}],"name":"checkOrderStatus","outputs":[{"name":"stepsCompleted","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"biz_name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"catalogue","outputs":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"imageURL","type":"string"},{"name":"forSale","type":"bool"},{"name":"price","type":"uint256"},{"name":"ordersReceived","type":"uint256"},{"name":"supplyChainLength","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amt","type":"uint256"}],"name":"payDividend","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"supplyChains","outputs":[{"name":"description","type":"string"},{"name":"incentiviser","type":"address"},{"name":"fee","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"evaluator","type":"address"},{"name":"fee","type":"uint256"}],"name":"addSupplyStep","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"orderID","type":"uint256"}],"name":"paySuppliersForOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"equityTaken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bestowee","type":"address"},{"name":"which","type":"uint256"}],"name":"bestowPermission","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sharesToTransfer","type":"uint256"},{"name":"recipient","type":"address"}],"name":"transferShares","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"b32","type":"bytes32"}],"name":"bytes32ToBytes","outputs":[{"name":"b","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"step","type":"uint256"}],"name":"paySupplier","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"shares","type":"uint256"},{"name":"recipient","type":"address"}],"name":"giveUnallocatedShares","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"}],"name":"listProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint256"}],"name":"uintToBytes","outputs":[{"name":"b","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"newPrice","type":"uint256"}],"name":"changePrice","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"description_","type":"string"}],"name":"addDescription","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"orders","outputs":[{"name":"complete","type":"bool"},{"name":"suppliersPaid","type":"bool"},{"name":"customerData","type":"string"},{"name":"stepsCompleted","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"price","type":"uint256"}],"name":"releaseProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"imageURL_","type":"string"}],"name":"addImageUrl","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name_","type":"string"}],"name":"setMyName","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"customerInfo","type":"string"}],"name":"order","outputs":[{"name":"orderPlaced","type":"bool"},{"name":"delivered","type":"address"},{"name":"orderID","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ownersRegistered","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"source","type":"string"}],"name":"stringToBytes","outputs":[{"name":"result","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"stake","type":"uint256"},{"name":"recipient","type":"address"}],"name":"dilute","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"}],"name":"delistProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"equityToSender","type":"uint256"},{"name":"_totalShares","type":"uint256"},{"name":"_name","type":"string"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"}],"name":"OwnershipModified","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"},{"indexed":false,"name":"productID","type":"uint256"}],"name":"ProductReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"},{"indexed":false,"name":"productID","type":"uint256"}],"name":"ProductModified","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"productID","type":"uint256"},{"indexed":false,"name":"orderID","type":"uint256"}],"name":"OrderReceived","type":"event"}]);

autobizAddr = null;

autobiz = null;

productsInCatalogue = 0;

window.addEventListener('load', async () => {

  document.getElementById("dashboard").innerHTML = "<h1>Bountium is a dapp built on the Ethereum blockchain. You need an Ethereum wallet to use it - we recommend metamask, which you can install <a href = \'https://metamask.io\'>here</a></h1>";

  // check for metamask
  if(typeof web3 !== 'undefined') {
    await ethereum.enable();
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  try {
    userAccount = web3.eth.accounts[0];
    updateInterface();
    var accountInterval = setInterval(function() {
      if (web3.eth.accounts[0] !== userAccount) {
        userAccount = web3.eth.accounts[0];
        updateInterface();
      }
    }, 100);
  } catch (e) {
    console.error(e);
  }
});

function updateInterface() {
  document.getElementById("workflow-container").innerHTML = "";
  var addr = location.search;
  if (addr.includes("0x")) {
    autobizAddr = addr.substring(addr.indexOf("0x"));
    // presuming its a valid autobiz addr... TODO
    autobiz = autobizABI.at(autobizAddr);
    renderStore();
  } else {
    ReactDOM.render(
      React.createElement(Welcome, null, userAccount),
      document.getElementById("dashboard")
    );
  }
}

var Welcome = React.createClass({

  renderStore : function() {
    autobizAddr = document.getElementById("store-addr-input").value;
    autobiz = autobizABI.at(autobizAddr);
    renderStore();
  },

  render : function() {
    var br = React.createElement("br", {});
    return React.createElement("div", {className:"welcome"},
      React.createElement("h1", {}, "Welcome!"),
      React.createElement("div", {className:"view-store-form"},
        React.createElement("h4", {}, "Shop at an autobiz"),
        React.createElement("p", {}, "Example at: 0xa24af57cf89ac03a5b760e2955ed288266270cd2"),
        React.createElement("input", {type:"text", id:"store-addr-input", placeholder:"Desired Autobiz's address"}),
        br, br,
        React.createElement("button", {id:"store-addr-input-btn", onClick:this.renderStore}, "Go!")
      )
    )
  }
});

function renderStore() {
  document.getElementById("dashboard").innerHTML = "";
  ReactDOM.render(
    React.createElement(StoreOverview, {customer:true}, userAccount),
    document.getElementById("dashboard")
  )
}

var StoreOverview = React.createClass({

  getInitialState : function() {
    var bizName_ = "anonymous business";
    autobiz.biz_name(function(err, res) {
      if (res!="")
        bizName_ = res;
    });
    var orderReceived = autobiz.OrderReceived((err, res) => {
      if (err)
        console.error(err)
      if (typeof res.args.productID !== 'undefined')
        alert("Success! Your order has been confirmed for product with ID: " + res.args.productID + " with orderID " + res.args.orderID + ". Save these somewhere in order to check your order's status later.");
    });
    var catalogue = [];
    // upper lim on how many products to fetch
    var maxProducts = 100;
    for (let i = 0; i < maxProducts; i++) {
      autobiz.catalogue(i, (err, res) => {
        if (err) {
          if(err.message.includes("not a base 16")) {
            return {
              expanded : false,
              catalogue : catalogue,
              bizName : bizName_
            }
          } else {
            console.error(err)
          }
        } else {
          // Assumes no one is intentionally naming a product ""
          if (res[0] != "") {
            if (res[3])
              catalogue.push({
                name : res[0],
                description : res[1],
                imageUrl : res[2],
                forSale : res[3],
                price : res[4],
                ordersReceived : res[5],
                supplyChainLength : res[6]
              });
          } else {
            return {
              expanded : false,
              catalogue : catalogue,
              bizName : bizName_
            }
          }
        }
      });
    }
    return {
      expanded : false,
      catalogue : catalogue,
      bizName : bizName_
    }
  },

  expand : function() {
    this.setState({expanded:true});
  },

  collapse : function() {
    this.setState({expanded:false});
  },

  order : function(productID) {
    autobiz.order(productID, document.getElementById("customer-info-input-" + productID).value,
      {from:userAccount, value:this.state.catalogue[productID].price},
      function(err, res) {
        if (err) {
          console.error(err)
        } else {
          // TODO why don't this run on tx confirm :(((
          alert("Your order has been sent and is awaiting confirmation");
        }
      }
    );
  },

  mapCatalogue : function(product, key) {
    return React.createElement("div", {className:"product-card", key:key},
      React.createElement("h5", {}, product.name),
      React.createElement("img", {className:"product-card-img", src:product.imageUrl}),
      React.createElement("p", {}, product.description),
      React.createElement("p", {}, "Price: " + product.price + " wei"),
      React.createElement("label", {for:"customer-info-input-" + key}, "Input your delivery information"),
      React.createElement("br", {}),
      React.createElement("input", {type:"text", id:"customer-info-input-" + key, placeholder:"A email or physical address, most likely"}),
      React.createElement("br", {}),
      React.createElement("button", {className:"order-btn", onClick:() => this.order(key)}, "Order")
    );
  },

  lookupOrder : function() {
    autobiz.checkOrderStatus(
      document.getElementById("product-id-input").value,
      document.getElementById("order-id-input").value,
      function(err, res) {
        if (err)
          console.error(err)
        else
          // TODO way to let owner make note of progress? or have autobiz auto-mark
          // steps in the supply chain as completed, so we can say "3/5 steps done"
          // or "in delivery" for example?
          autobiz.catalogue(document.getElementById("product-id-input").value,
            function(err1, res1) {
              if (err1)
                console.error(err1);
              else {
                if (res1[6] == res)
                  alert("Your order has been completed");
                else if (res1[6] == res + 1)
                  alert("Your order is manufactured, and being delivered to you!");
                else
                  alert(res + " out of " + res1[6] + " steps have been finished in completing your order");
              }
            }
          );
      }
    );
  },

  render : function() {
    var catalogueList = React.createElement("p", {}, "This business has not listed any products for sale!");
    var orderChecker = React.createElement("div", {className:"order-checker"},
      React.createElement("h4", {}, "Check an order's status"),
      React.createElement("label", {for:"product-id-input"}, "Input the product and order id"),
      React.createElement("br", {}),
      React.createElement("input", {type:"number", id:"product-id-input"}),
      React.createElement("br", {}),
      React.createElement("input", {type:"number", id:"order-id-input"}),
      React.createElement("br", {}),
      React.createElement("button", {onClick:this.lookupOrder}, "Lookup")
    );
    if (this.state.catalogue.length >= 0)
      catalogueList = this.state.catalogue.map(this.mapCatalogue);
    var storeHeader = React.createElement("div", {className:"store-header"},
      React.createElement("h3", null, "Welcome to the store of: " + this.state.bizName),
      orderChecker
    );
    if (this.state.expanded)
      return React.createElement("div", {className:"store-overview"},
        storeHeader, React.createElement("br", {}),
        React.createElement("div", {className:"catalogue-feed-customer"},
          React.createElement("h3", null, "Products Available"),
          React.createElement("button", {className:"toggle-expand-collapse", onClick:this.collapse}, "-"),
          catalogueList
        )
      );
    return React.createElement("div", {className:"store-overview"},
      storeHeader, React.createElement("br", {}),
      React.createElement("div", {className:"catalogue-feed-customer"},
        React.createElement("h3", null, "Products Available"),
        React.createElement("button", {className:"toggle-expand-collapse", onClick:this.expand}, "+")
      )
    );
  }

});

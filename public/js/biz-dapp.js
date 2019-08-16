// TODO products don't always come back in the right order - minor issue,
// fixed any reprecussions. just aesthetic now.
// TODO allow owners to set their name in OO
// TODO implement supply step descriptions both here in adding supply step,
// and in contract's addSupplyStep
// TODO replace all "get next order/step" with async fetching
// TODO add more details to display in customer view of store:
  // info about how it is being assured for delivery (ie, guarantees)
  // info about store - their history, reviews, etc
// TODO guide biz owners on assessor setup:
  // using public incents (incorporate registrar contract):
    // level 0: suggest most popular incents
    // level 1: suggest incents based on product key words
  // guide them on deploying their own incent
// TODO cache a user's business address so that they don't have to re-enter it
// TODO darken rest of screen on popups
// TODO move all events listening for catalogue mods to one listener in the
// catalogue overview rather than within each func call
// TODO get usd prices via:
  // alphavantage: https://www.alphavantage.co/documentation/
  // key: CQ59WM0QX9LW34XT

var autobizABI = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"owners","outputs":[{"name":"stake","type":"uint256"},{"name":"callsDividend","type":"bool"},{"name":"canDilute","type":"bool"},{"name":"canBestow","type":"bool"},{"name":"canModifyCatalogue","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"product","type":"uint256"},{"name":"orderID","type":"uint256"}],"name":"checkOrderStatus","outputs":[{"name":"stepsCompleted","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"biz_name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"catalogue","outputs":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"imageURL","type":"string"},{"name":"forSale","type":"bool"},{"name":"price","type":"uint256"},{"name":"ordersReceived","type":"uint256"},{"name":"orderOptions","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amt","type":"uint256"}],"name":"payDividend","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"supplyChains","outputs":[{"name":"description","type":"string"},{"name":"incentiviser","type":"address"},{"name":"fee","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"orderID","type":"uint256"}],"name":"paySuppliersForOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bestowee","type":"address"},{"name":"which","type":"uint256"}],"name":"bestowPermission","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sharesToTransfer","type":"uint256"},{"name":"recipient","type":"address"}],"name":"transferShares","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"imageURL","type":"string"},{"name":"list","type":"bool"},{"name":"price","type":"uint256"},{"name":"orderOptions","type":"string"}],"name":"setProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"step","type":"uint256"}],"name":"paySupplier","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"}],"name":"listProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"genInstr","type":"string"},{"name":"specInstr","type":"string"}],"name":"craftBountyJSON","outputs":[{"name":"result","type":"string"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"options","type":"string"}],"name":"addOptions","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"imageURL","type":"string"},{"name":"list","type":"bool"},{"name":"price","type":"uint256"},{"name":"orderOptions","type":"string"}],"name":"releaseProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"newPrice","type":"uint256"}],"name":"changePrice","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"description_","type":"string"}],"name":"addDescription","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"orders","outputs":[{"name":"complete","type":"bool"},{"name":"suppliersPaid","type":"bool"},{"name":"orderInfo","type":"string"},{"name":"stepsCompleted","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"price","type":"uint256"}],"name":"releaseProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"imageURL_","type":"string"}],"name":"addImageUrl","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"evaluator","type":"address"},{"name":"fee","type":"uint256"},{"name":"instructions","type":"string"}],"name":"addSupplyStep","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"orderInfo","type":"string"}],"name":"order","outputs":[{"name":"orderPlaced","type":"bool"},{"name":"delivered","type":"address"},{"name":"orderID","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ownersRegistered","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"stake","type":"uint256"},{"name":"recipient","type":"address"}],"name":"dilute","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"}],"name":"delistProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_name","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"},{"indexed":false,"name":"productID","type":"uint256"}],"name":"ProductReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"},{"indexed":false,"name":"productID","type":"uint256"}],"name":"ProductModified","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"productID","type":"uint256"},{"indexed":false,"name":"orderID","type":"uint256"}],"name":"OrderReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"}],"name":"OwnershipModified","type":"event"}]);

autobizAddr = null;

autobiz = null;

window.addEventListener('load', async () => {

  document.getElementById("dashboard").innerHTML = "<div class=\"container-fluid\"><h1>Bountium is a dapp built on the Ethereum blockchain. You need an Ethereum wallet to use it - we recommend metamask, which you can install <a href = \'https://metamask.io\'>here</a></h1></div>";
  ReactDOM.render(
    React.createElement(Navbar, {}),
    document.getElementById("navbar")
  );

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
    renderDashboard();
  } else {
    ReactDOM.render(
      React.createElement(Welcome, null, userAccount),
      document.getElementById("dashboard")
    );
  }
}

var Welcome = React.createClass({

  newBiz : function() {
    newBizWorkflow();
  },

  renderDashboard : function () {
    autobizAddr = document.getElementById("autobiz-addr-input").value;
    autobiz = autobizABI.at(autobizAddr);
    renderDashboard();
  },

  render : function() {
    var br = React.createElement("br", {});
    return React.createElement("div", {className:"container-fluid"},
      React.createElement("div", {className:"autobiz-addr-form"},
        React.createElement("h3", {}, "Manage my Bountium-powered business"),
        React.createElement("input", {type:"text", id:"autobiz-addr-input", className:"form-control col-8", placeholder:"Your Autobiz's address"}),
        React.createElement("button", {className:"btn btn-primary mt-2",id:"autobiz-addr-input-btn", onClick:this.renderDashboard}, "Go!")
      )
    )
  }
})

function renderDashboard() {
  autobiz.isOwner(userAccount, function(err, res) {
    if (res) {
      document.getElementById("dashboard").innerHTML = "";
      ReactDOM.render(
        React.createElement(Dashboard, null, userAccount),
        document.getElementById("dashboard")
      );
    } else {
      alert("You are not registered as an owner of that business - double check that you are using the same account in Metamask as the one you used to create this business (or, the account that a previous owner allocated your shares to)");
    }
  });
}

var Dashboard = React.createClass({

  getInitialState : function() {
    return {
      viewingOrg : true,
      viewingProducts : false,
      viewingOps : false,
      viewingChat : false,
      bizName : "anonymous business"
    }
  },

  componentDidMount : function() {
    autobiz.biz_name((err, res) => {
      if (res!="")
        this.setState({bizName : res});
    });
  },

  viewProducts : function() {
    this.setState({viewingProducts : true});
    this.setState({viewingOrg : false});
    this.setState({viewingOps : false});
    this.setState({viewingChat : false});
  },

  viewOrg : function() {
    this.setState({viewingProducts : false});
    this.setState({viewingOrg : true});
    this.setState({viewingOps : false});
    this.setState({viewingChat : false});
  },

  viewOps : function() {
    this.setState({viewingProducts : false});
    this.setState({viewingOrg : false});
    this.setState({viewingOps : true});
    this.setState({viewingChat : false});
  },

  viewChat : function() {
    this.setState({viewingProducts : false});
    this.setState({viewingOrg : false});
    this.setState({viewingOps : false});
    this.setState({viewingChat : true});
  },

  render : function() {
    var managerNavbar = React.createElement("div", {},
        React.createElement("ul", {className:"nav navbar"},
          React.createElement("li", {className:"nav-item display-4 col-4" + (this.state.viewingOrg ? " border-bottom" : ""), onClick:this.viewOrg},
            React.createElement("h4", {className:"text-center"}, "Organisation")
          ),
          React.createElement("li", {className:"nav-item display-4 col-4" + (this.state.viewingProducts ? " border-bottom" : ""), onClick:this.viewProducts},
            React.createElement("h4", {className:"text-center"}, "Products")
          ),
          React.createElement("li", {className:"nav-item display-4 col-4" + (this.state.viewingOps ? " border-bottom" : ""), onClick:this.viewOps},
            React.createElement("h4", {className:"text-center"}, "Operations")
          )
          /* Deprecating collaboration tab:
          ,
          React.createElement("li", {className:"nav-item display-4 col-3" + (this.state.viewingChat ? " border-bottom" : ""), onClick:this.viewChat},
            React.createElement("h4", {className:"text-center"}, "Collaboration")
          )
          */
        )
      )
    return React.createElement("div", {className:"container-fluid"},
      React.createElement("div", {className:"row mb-2"},
        React.createElement("h3", {className:"ml-5"}, "Managing: " + this.state.bizName),
        React.createElement("a", {className:"btn btn-primary ml-auto mr-5", href:"http://shop.bountium.org/?" + autobiz.address, target:"_blank"}, "View My Store"),
      ),
      managerNavbar,
      this.state.viewingOrg && React.createElement(OrgOverview, {autobiz:autobiz}),
      this.state.viewingProducts && React.createElement(CatalogueOverview, {autobiz:autobiz}),
      this.state.viewingOps && React.createElement(OpsOveriew, {autobiz:autobiz}),
      this.state.viewingChat && React.createElement(CollabOverview, {autobiz:autobiz, userAccount : userAccount})
    );
  }

});

function renderNotOwnerError() {
  ReactDOM.render(
    React.createElement(NotOwnerError, {}),
    document.getElementById("dashboard")
  );
};

// Override alert function to use _B_ootstrap
window.alert = function(text) {
  ReactDOM.render(
    React.createElement("div", {
      className:"alert alert-warning alert-dismissible fixed-top zindex-popover",
      role:"alert",
      id:"to-dismiss",
      onClick:function() { document.getElementById("to-dismiss").remove() }},
      text,
      React.createElement("button", {
        type:"button",
        className:"close",
        dataDismiss:"alert",
        ariaLabel:"Close",
        onClick:function() { document.getElementById("to-dismiss").remove() }
      }, React.createElement("span", {ariaHidden:"true"}, "x"))
    ),
    document.getElementById("workflow-container")
  );
  setTimeout(function(){
    document.getElementById("to-dismiss").remove()
  }, 5000)
}

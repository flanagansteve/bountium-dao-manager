// TODO on all product state mods, call updateCatalogue() in catalogue react obj
// TODO check for success on each state mod, rather than blindly assuring user

// For adding supply steps:
liveMarketAddr = "0xfce2e8c52578026ddaa24899921586591bb73fca";
testMarketAddr = "0xe748d6628cb4f0e87c48509b227b82f831411733";

var ModifyProduct = React.createClass({

  // TODO show users info abt assesor contracts in the supply chain
  getInitialState : function() {
    return {
      orders:[],
      supplyChain:[],
      noMoreSteps:false,
      noMoreOrders:false
    }
  },

  componentDidMount : function() {
    this.fetchBatchOfOrders();
    this.fetchSupplySteps();
  },

  fetchBatchOfOrders : function() {
    // Doing batches of 10 for now
    for (let i = 0; i < 10; i++) {
      if (this.state.supplyChain.length < this.props.product.ordersReceived - 1) {
        this.anotherOrder(i)
      } else {
        this.setState({noMoreOrders:true});
        return;
      }
    }
  },

  fetchSupplySteps : function() {
    // If anyone has a supply chain of over 15, they're crazy
    for (let i = 0; i < 15; i++)
      this.anotherStep(i)
    this.setState({noMoreSteps:true})
  },

  // fetch orders in order of recency, ie, descending order
  anotherOrder : function(orderNum) {
    console.log('grabbing order ' + orderNum)
    // TODO why do we have to click this twice
    var ordersArr = this.state.orders;
    autobiz.orders(this.props.id, orderNum, (err, res) => {
      if (res) {
        ordersArr.push({
          id : orderNum,
          status : res[0],
          paidOut : res[1],
          customerData : res[2]
          // TODO how to represent the array of supply bounties here? a link to it maybe?
        })
        this.setState({orders:ordersArr});
        this.setState({noMoreOrders:this.state.orders.length >= this.props.product.ordersReceived});
      }
    })
  },

  mapOrders : function(order, key) {
    return React.createElement("tr", {key:key},
      React.createElement("td", {}, "" + order.id),
      React.createElement("td", {}, "" + order.customerData),
      React.createElement("td", {}, "" + order.status),
      React.createElement("td", {},
        React.createElement("button", {className:"btn btn-primary",onClick:() => this.paySupplier(order.id)}, "Pay")
      )
    )
  },

  paySupplier : function(orderID) {
    autobiz.paySuppliersForOrder(this.props.id, orderID, function(e, r) {
      if(e)
        console.error(e);
      else
        alert("Request sent to contract");
    });
  },

  // fetch supply step in increasing order
  anotherStep : function(stepnum) {
    // TODO why do we have to click this twice
    var supplyChainArr = this.state.supplyChain;
    autobiz.supplyChains(this.props.id, stepnum, (err, res) => {
      if (res) {
        supplyChainArr.push({
          description : "" + res[0],
          incentAddress : res[1],
          fee : res[2]
        })
        this.setState({supplyChain:supplyChainArr});
      }
    })
  },

  mapSteps : function(step, key) {
    return React.createElement("tr", {key:key},
      React.createElement("td", {}, key),
      React.createElement("td", {}, step.description),
      React.createElement("td", {}, step.incentAddress),
      React.createElement("td", {}, "" + step.fee)
    )
  },

  addSupplyStep : function() {
    autobiz.addSupplyStep(
      this.props.id,
      testMarketAddr,
      Number(web3.toWei(document.getElementById("new-supply-step-fee-input").value, 'ether')),
      document.getElementById("new-supply-step-instructions-input").value,
      (err, res) => {
        if (err)
          console.error(err)
        else {
          alert("Request to add this step is on its way!");
          var confirmMod = autobiz.ProductModified((err, res) => {
            if (err)
              console.error(err);
            else
              alert("Successfully added supply step");
              this.props.refreshCatalogue();
          });
        }
      }
    );
  },

  list : function() {
    autobiz.listProduct(this.props.id, (err, res) => {
      if (err)
        console.error(err)
      else {
        alert("Request to list this product is on its way!");
        var confirmMod = autobiz.ProductModified((err, res) => {
          if (err)
            console.error(err);
          else
            alert("Successfully listed this product");
            this.props.refreshCatalogue();
        })
      }
    });
  },

  delist : function() {
    autobiz.delistProduct(this.props.id, (err, res) => {
      if (err)
        console.error(err)
      else {
        alert("Request to delist this product is on its way!");
        var confirmMod = autobiz.ProductModified((err, res) => {
          if (err)
            console.error(err);
          else
            alert("Successfully delisted this product");
            this.props.refreshCatalogue();
        })
      }
    });
  },

  changePrice : function() {
    autobiz.changePrice(
      this.props.id,
      Number(web3.toWei(document.getElementById("change-price-input").value, 'ether')),
      (err, res) => {
        if (err)
          console.error(err)
        else {
          alert("Request to change price is on its way!");
          var confirmMod = autobiz.ProductModified((err, res) => {
            if (err)
              console.error(err);
            else
              alert("Successfully changed price");
              this.props.refreshCatalogue();
          })
        }
      }
    );
  },

  addDescription : function() {
    autobiz.addDescription(this.props.id, document.getElementById("add-description-input").value, (err, res) => {
      if (err)
        console.error(err)
      else {
        alert("Request to update description is on its way!");
        var confirmMod = autobiz.ProductModified((err, res) => {
          if (err)
            console.error(err);
          else
            alert("Successfully updated description");
            this.props.refreshCatalogue();
        })
      }
    });
  },

  addImageUrl : function() {
    // TODO check that the provided url is indeed an img, perhaps look at file type?
    autobiz.addImageUrl(this.props.id, document.getElementById("add-image-url-input").value, (err, res) => {
      if (err)
        console.error(err)
      else {
        alert("Request to update image url is on its way");
        var confirmMod = autobiz.ProductModified((err, res) => {
          if (err)
            console.error(err);
          else
            alert("Successfully updated image url");
            this.props.refreshCatalogue();
        })
      }
    });
  },

  guideIncentivisers : function() {
    // TODO make this one day suggest popular incentivsiers and let people discover
    // some by keyword
    alert("An incentiviser is the contract to which your business will place bounties for steps in its supply chain. The incentiviser contract is what ensures the supply chain is completed properly - so it is very important to choose carefully! If you'd like an example incentiviser contract, try this one: 0x54a93a193babd89c46ef4f12f7f550a0e1cdc95d. It will reward any response given to it :)");
  },

  // TODO let a business owner configure the selectable custom options on the product

  sendMods : function(productID) {
    // TODO
  },

  render : function() {
    // TODO let an owner see & set the configurable fields of a product
    // TODO only show several of these forms if user.canModifyCatalogue
    return React.createElement("div", {className:"container-fluid row", onMouseOver:(this.state.noMoreOrders ? this.fetchBatchOfOrders : null)},
      React.createElement("div", {className:"col-md-4"},
        React.createElement("img", {className:"img-thumbnail", alt:this.props.product.name, src:this.props.product.imageUrl}),
        React.createElement("div", {className:"form mb-3"},
          React.createElement("label", {for:"add-image-url-input"}, "Update the image of this product"),
          React.createElement("input", {type:"text", className:"form-control", placeholder:"Upload it to a host like imgur or IPFS", id:"add-image-url-input"}),
          React.createElement("button", {className:"btn btn-primary mt-2", onClick:this.addImageUrl}, "Update image url")
        ),
        React.createElement("div", {className:"col"},
          React.createElement("div", {className:"row mt-2"},
            React.createElement("button", {className:"btn btn-info", onClick:() => this.sendMods(this.props.id)}, "Save Changes")
          ),
          React.createElement("div", {className:"row mt-2"},
            React.createElement("button", {className:"btn btn-secondary", onClick : this.props.cancel}, "Cancel")
          )
        )
      ),
      React.createElement("div", {className:"col-md-8 mt-2 mt-md-0 pt-2"},
        React.createElement("h5", {}, this.props.product.name),
        React.createElement("div", {className:"row"},
          React.createElement("p", {className:"col-6"}, "Price: " + web3.fromWei(this.props.product.price, "ether") + " ETH"),
          React.createElement("p", {}, "Orders Received: " + this.props.product.ordersReceived)
        ),
        React.createElement("div", {className:"form row col-12 mb-3"},
        React.createElement("label", {for:"change-price-input"}, "Update the price of this product (in ETH)"),
        React.createElement("input", {type:"number", className:"form-control", id:"change-price-input"}),
          React.createElement("button", {className:"btn btn-primary mt-2 float-right", onClick:this.changePrice}, "Change price")
        ),
        React.createElement("div", {className:"popup-product-ov"},
          React.createElement("div", {className:"current-product-details"},
            React.createElement("div", {className:"row"},
              React.createElement("p", {className:"col-6"}, "For Sale: " + (this.props.product.forSale ? "Yes" : "No")),
              (this.props.product.forSale ?
                React.createElement("button", {className:"btn btn-danger ml-2 mt-n2", onClick:this.delist}, "Delist")
                : React.createElement("button", {className:"btn btn-primary ml-2 mt-n2", onClick:this.list}, "List")
              )
            ),
            React.createElement("p", {}, "Description: " + this.props.product.description),
            React.createElement("div", {className:"form row col-12 mb-3"},
              React.createElement("label", {for:"add-description-input"}, "Update the description of this product"),
              React.createElement("textarea", {className:"form-control", placeholder:"Product details and assurances go here!", id:"add-description-input"}),
              React.createElement("button", {className:"btn btn-primary mt-2 float-right", onClick:this.addDescription}, "Update description")
            )
          ),
          React.createElement("h3", {}, "Supply chain steps:"),
          (!this.state.noMoreSteps &&
            React.createElement("img", {src:"/img/loading.gif"})),
          ((this.state.noMoreSteps && this.state.supplyChain.length > 0) && React.createElement("table", {className:"table"},
            React.createElement("tbody", {},
              React.createElement("tr", {},
                React.createElement("th", {}, "Step #"),
                React.createElement("th", {}, "Instructions"),
                React.createElement("th", {}, "Incentiviser Address"),
                React.createElement("th", {}, "Fee")
              ),
              this.state.supplyChain.map(this.mapSteps)
            )
          )),
          ((this.state.noMoreSteps && this.state.supplyChain.length == 0) && React.createElement("table", {className:"table"},
            React.createElement("p", {}, "No steps set for this product - add one via the form below")
          )),
          React.createElement("div", {className:"form row col-12 mb-3"},
            React.createElement("h6", {}, "Add a supply step to this product's supply chain"),
            React.createElement("label", {for:"new-supply-step-instructions-input"}, "Instructions for this step"),
            React.createElement("textarea", {id:"new-supply-step-instructions-input", className:"form-control", placeholder:"What do you need done when an order is received? Be sure to include how a supplier should use order-specific information if necessary."}),
            React.createElement("label", {for:"change-price-input"}, "Fee you will pay for this step (in ETH)"),
            React.createElement("input", {type:"number", id:"new-supply-step-fee-input", className:"form-control"}),
            React.createElement("button", {className:"btn btn-primary mt-2 mb-2 float-right", onClick:this.addSupplyStep}, "Add supply step")
          ),
          React.createElement("h3", {}, "Orders received:"),
          ((this.state.noMoreOrders && this.props.product.ordersReceived > 0) && React.createElement("table", {className:"table"},
            React.createElement("tbody", {},
              React.createElement("tr", {},
                React.createElement("th", {}, "Order ID"),
                React.createElement("th", {}, "Customer Data"),
                React.createElement("th", {}, "Completed?"),
                React.createElement("th", {}, "Pay Suppliers")
              ),
              this.state.orders.map(this.mapOrders)
            ))
          ),
          ((!this.state.noMoreOrders && this.props.product.ordersReceived > 0) &&
            React.createElement("img", {src:"/img/loading.gif"})),
          (this.props.product.ordersReceived == 0 && React.createElement("table", {className:"table"},
            React.createElement("p", {}, "No orders received yet!")
          ))
        )
      )
    );
  }

});

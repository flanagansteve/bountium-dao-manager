// TODO on all product state mods, call updateCatalogue() in catalogue react obj
// TODO check for success on each state mod, rather than blindly assuring user

var ModifyProduct = React.createClass({

  // TODO show users info abt assesor contracts in the supply chain
  getInitialState : function() {
    return {
      orders:[],
      supplyChain:[]
    }
  },

  // fetch orders in order of recency, ie, descending order
  anotherOrder : function() {
    // TODO why do we have to click this twice
    var ordersArr = this.state.orders;
    autobiz.orders(this.props.id, this.props.ordersReceived - ordersArr.length - 1, (err, res) => {
      if (res)
        ordersArr.push({
          id : this.props.ordersReceived - ordersArr.length - 1,
          status : res[0],
          paidOut : res[1],
          customerData : res[2]
          // TODO how to represent the array of supply bounties here? a link to it maybe?
        })
    })
    this.setState({orders:ordersArr});
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
  anotherStep : function() {
    // TODO why do we have to click this twice
    var supplyChainArr = this.state.supplyChain;
    autobiz.supplyChains(this.props.id, supplyChainArr.length, (err, res) => {
      if (res)
        supplyChainArr.push({
          description : "Description: " + res[0],
          incentAddress : res[1],
          fee : res[2]
        })
    })
    this.setState({supplyChain:supplyChainArr});
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
      this.props.productID,
      document.getElementById("new-supply-step-addr-input").value,
      document.getElementById("new-supply-step-fee-input").value,
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
              this.x();
          });
        }
      }
    );
  },

  list : function() {
    autobiz.listProduct(this.props.productID, (err, res) => {
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
            this.x();
        })
      }
    });
  },

  delist : function() {
    autobiz.delistProduct(this.props.productID, (err, res) => {
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
            this.x();
        })
      }
    });
  },

  changePrice : function() {
    autobiz.changePrice(this.props.productID, document.getElementById("change-price-input").value, (err, res) => {
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
            this.x();
        })
      }
    });
  },

  addDescription : function() {
    autobiz.addDescription(this.props.productID, document.getElementById("add-description-input").value, (err, res) => {
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
            this.x();
        })
      }
    });
  },

  addImageUrl : function() {
    // TODO check that the provided url is indeed an img, perhaps look at file type?
    autobiz.addImageUrl(this.props.productID, document.getElementById("add-image-url-input").value, (err, res) => {
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
            this.x();
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
    var br = React.createElement("br", {})
    var header = React.createElement("h3", {}, this.props.children);
    var currentProductDetails = React.createElement("div", {className:"current-product-details"},
      React.createElement("img", {src:this.props.imageUrl}),
      React.createElement("p", {}, "Price: " + this.props.price),
      React.createElement("p", {}, "Orders Received: " + this.props.ordersReceived),
      React.createElement("p", {}, "For Sale: " + this.props.forSale),
      React.createElement("p", {}, "Description: " + this.props.description)
    );
    var nextStepButton = React.createElement("p", {className:"all-x-displayed", id:"all-steps-received-note"}, "All steps displayed");
    if (this.props.supplyChainLength - this.state.supplyChain.length > 0)
      nextStepButton = React.createElement("button", {className:"btn btn-primary", onClick:this.anotherStep}, "Get next step in the supply chain");
    var nextOrderBtn = React.createElement("p", {className:"all-x-displayed", id:"all-orders-received-note"}, "All orders displayed");
    if (this.props.ordersReceived - this.state.orders.length > 0)
      nextOrderBtn = React.createElement("button", {className:"btn btn-primary",onClick:this.anotherOrder}, "Get next order from contract");
    // TODO only show these ones if user.canModifyCatalogue
    var newSupplyStepForm = React.createElement("div", {className:"product-actions-form", id:"add-supply-step-product-actions-form"},
      React.createElement("h6", {}, "Add a supply step to this product's supply chain"),
      React.createElement("a", {href:"#", id:"incentiviser-guide-click", onClick:this.guideIncentivisers}, "(Help me pick an incentiviser!)"),
      React.createElement("label", {for:"new-supply-step-addr-input"}, "Address of incentiviser for this supply step"),
      React.createElement("input", {type:"text", id:"new-supply-step-addr-input", placeholder:"0x123..."}),
      br,
      React.createElement("label", {for:"change-price-input"}, "Fee your business will pay for this step"),
      React.createElement("input", {type:"number", id:"new-supply-step-fee-input"}),
      br,
      React.createElement("button", {className:"btn btn-primary",onClick:this.addSupplyStep, className:"product-mod-btn"}, "Add supply step")
    );
    var changePriceForm = React.createElement("div", {className:"product-actions-form"},
      React.createElement("label", {for:"change-price-input"}, "Change the price of this product"),
      React.createElement("input", {type:"number", id:"change-price-input"}),
      br,
      React.createElement("button", {className:"btn btn-primary",onClick:this.changePrice, className:"product-mod-btn"}, "Change price")
    );
    var changeDescriptForm = React.createElement("div", {className:"product-actions-form"},
      React.createElement("label", {for:"add-description-input"}, "Update the description of this product"),
      React.createElement("input", {type:"text", placeholder:"Product details and assurances go here!", id:"add-description-input"}),
      br,
      React.createElement("button", {className:"btn btn-primary",onClick:this.addDescription, className:"product-mod-btn"}, "Update description")
    );
    var changeImageUrlForm = React.createElement("div", {className:"product-actions-form"},
      React.createElement("label", {for:"add-image-url-input"}, "Update the image of this product"),
      React.createElement("input", {type:"text", placeholder:"Upload it to a host like imgur or IPFS", id:"add-image-url-input"}),
      br,
      React.createElement("button", {className:"btn btn-primary",onClick:this.addImageUrl, className:"product-mod-btn"}, "Update image url")
    );
    var listDelist = React.createElement("button", {className:"btn btn-primary",onClick:this.list, className:"product-mod-btn"}, "List product");
    if (this.props.forSale)
      listDelist = React.createElement("button", {className:"btn btn-primary",onClick:this.delist, className:"product-mod-btn"}, "Delist product");
    return React.createElement("div", {className:"container-fluid row"},
      React.createElement("img", {className:"img col-md-4", alt:this.props.product.name, src:this.props.product.imageUrl}),
      React.createElement("div", {className:"col-md-8 border mt-2 mt-md-0 pt-2"},
        React.createElement("h5", {}, this.props.product.name),
        React.createElement("p", {}, this.props.product.description),
        React.createElement("p", {}, "Price: " + web3.fromWei(this.props.product.price, "ether") + " ETH"),
        (this.props.product.orderOptions.length > 0 && React.createElement("div", {},
          Object.keys(JSON.parse(this.props.product.orderOptions)).map(this.optionSetRadioForms)
        )),
        React.createElement("div", {className:"popup-product-ov"},
          header, currentProductDetails,
          React.createElement("h3", {}, "Supply chain steps:"),
          React.createElement("table", {className:"new-product-supply-steps"},
            React.createElement("tbody", {},
              React.createElement("tr", {},
                React.createElement("th", {}, "Step #"),
                React.createElement("th", {}, "Description"),
                React.createElement("th", {}, "Incentiviser Address"),
                React.createElement("th", {}, "Fee")
              ),
              this.state.supplyChain.map(this.mapSteps)
            )
          ),
          nextStepButton,
          React.createElement("h3", {}, "Orders received:"),
          React.createElement("table", {className:"new-product-supply-steps"},
            React.createElement("tbody", {},
              React.createElement("tr", {},
                React.createElement("th", {}, "Order ID"),
                React.createElement("th", {}, "Customer Data"),
                React.createElement("th", {}, "Completed?"),
                React.createElement("th", {}, "Pay Suppliers")
              ),
              this.state.orders.map(this.mapOrders)
            )
          ),
          nextOrderBtn,
          newSupplyStepForm, br,
          changePriceForm, br,
          changeDescriptForm, br,
          changeImageUrlForm, br,
          listDelist
        ),
        React.createElement("button", {className:"btn btn-primary mb-1", onClick:() => this.sendMods(this.props.id)}, "Save Changes")
      )
    );
  }

});

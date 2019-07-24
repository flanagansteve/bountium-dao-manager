// TODO on all product state mods, call updateCatalogue() in catalogue react obj
// TODO check for success on each state mod, rather than blindly assuring user

// For adding supply steps:
liveMarketAddr = "0xfce2e8c52578026ddaa24899921586591bb73fca";
testMarketAddr = "0xe748d6628cb4f0e87c48509b227b82f831411733";

var ModifyProduct = React.createClass({

  // TODO show users info abt assesor contracts in the supply chain
  getInitialState : function() {
    var co = {notset:true};
    if (this.props.product.orderOptions && this.props.product.orderOptions !== "")
      co = JSON.parse(this.props.product.orderOptions)
    return {
      orders : [],
      supplyChain : [],
      noMoreSteps : false,
      noMoreOrders : false,
      newConfigName : "",
      newConfigFields : [],
      configurableOptions : co
    }
  },

  componentDidMount : function() {
    this.fetchBatchOfOrders();
    this.fetchSupplySteps();
  },

  fetchBatchOfOrders : function() {
    // Doing batches of 10 for now
    for (let i = 0; i < 10; i++) {
      if (this.state.orders.length < this.props.product.ordersReceived - 1) {
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
            if (err) {
              console.error(err);
            } else {
              alert("Successfully added supply step");
              this.props.refreshCatalogue();
            }
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
          if (err) {
            console.error(err);
          } else {
            alert("Successfully listed this product");
            this.props.refreshCatalogue();
          }
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
          if (err) {
            console.error(err);
          } else {
            alert("Successfully delisted this product");
            this.props.refreshCatalogue();
          }
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
            if (err) {
              console.error(err);
            } else {
              alert("Successfully changed price");
              this.props.refreshCatalogue();
            }
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
          if (err) {
            console.error(err);
          } else {
            alert("Successfully updated description");
            this.props.refreshCatalogue();
          }
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
          if (err) {
            console.error(err);
          } else {
            alert("Successfully updated image url");
            this.props.refreshCatalogue();
          }
        })
      }
    });
  },

  renderConfigOptions : function(configObj, keyNum) {
    if (configObj.notset)
      return React.createElement("p", {key:keyNum}, "No customisable options set yet!")
    return React.createElement("div", {key:keyNum},
      React.createElement("div", {className:"row"},
        React.createElement("div", {className:"col-6"},
          React.createElement("b", {}, "Option name"),
        ),
        React.createElement("div", {className:"col-6"},
          React.createElement("b", {}, "Choices"),
        )
      ),
      Object.keys(configObj).map((key, keyNum) =>
        React.createElement("div", {key:keyNum, className:"row border"},
          React.createElement("div", {className:"col-6 border-right"},
            React.createElement("p", {}, key),
          ),
          // Each value in the config obj should be an array of strings
          // that represent the chooseable options
          React.createElement("div", {className:"col-6"},
            configObj[key].map((val, keyNum) => React.createElement("p", {key:keyNum}, val))
          )
        )
      )
    )
  },

  updateNewConfigName : function(e) {
    this.setState({newConfigName:e.target.value})
  },

  renderNewConfigFields : function(field, key) {
    return React.createElement("p", {key:key}, "Option ", key, ": ", field)
  },

  addNewConfigOption : function() {
    var configFields = this.state.newConfigFields;
    configFields.push(document.getElementById("new-config-option-input").value)
    this.setState({newConfigFields:configFields})
    document.getElementById("new-config-option-input").value = ""
  },

  sendNewConfig : function() {
    var configsToSend = this.state.configurableOptions;
    configsToSend[this.state.newConfigName] = this.state.newConfigFields;
    autobiz.addOptions(this.props.id, JSON.stringify(configsToSend), (err, res) => {
      if (err)
        console.error(err)
      else {
        alert("Request to update product options is on its way");
        var confirmMod = autobiz.ProductModified((err, res) => {
          if (err) {
            console.error(err);
          } else {
            alert("Successfully updated product options");
            this.props.refreshCatalogue();
          }
        })
      }
    })
  },

  sendMods : function(productID) {
    /*uint product,
      string memory name,
      string memory description,
      string memory imageURL,
      bool list,
      uint price,
      string memory orderOptions*/
    var configObj = {};
    configObj[this.state.newConfigName] = this.state.newConfigFields;
    autobiz.setProduct(productID,
      this.props.product.name,
      document.getElementById("add-description-input").value,
      document.getElementById("add-image-url-input").value,
      this.props.product.forSale,
      this.props.product.price,
      JSON.stringify(configObj),
      (err, res) => {
        if (err)
          console.error(err)
        else {
          alert("Your product and its details are on its way to your business's smart contract! Stand by if you'd like to wait for confirmation");
          var confirmMod = autobiz.ProductModified((err, res) => {
            if (err)
              console.error(err);
            else
              alert("Successfully released product");
              this.props.refreshCatalogue();
          })
        }
      }
    )
  },

  releaseDetailedProduct() {
    /*string memory name,
      string memory description,
      string memory imageURL,
      bool list,
      uint price,
      string memory orderOptions*/
    var configObj = {};
    configObj[this.state.newConfigName] = this.state.newConfigFields;
    autobiz.releaseProduct(
      this.props.product.name,
      document.getElementById("add-description-input").value,
      document.getElementById("add-image-url-input").value,
      document.getElementById("immediate-listing-input").value,
      this.props.product.price,
      JSON.stringify(configObj),
      (err, res) => {
        if (err)
          console.error(err)
        else {
          alert("Your product and its details are on its way to your business's smart contract! Stand by if you'd like to wait for confirmation");
          var confirmMod = autobiz.ProductModified((err, res) => {
            if (err)
              console.error(err);
            else
              alert("Successfully released product");
              this.props.refreshCatalogue();
          })
        }
      }
    )
  },

  render : function() {
    var updateOrSet = this.props.id !== -1 ? "Update" : "Set"
    // TODO only show several of these forms if user.canModifyCatalogue
    return React.createElement("div", {onMouseOver:(this.state.noMoreOrders ? this.fetchBatchOfOrders : null)},
      React.createElement("div", {className:"row mt-n5 float-right"},
        React.createElement("button", {className:"btn btn-secondary", onClick : this.props.cancel}, "X")
      ),
      React.createElement("div", {className:"container-fluid row"},
        React.createElement("div", {className:"col-md-4"},
          React.createElement("img", {className:"img-thumbnail", alt:(this.props.id !== -1 ? this.props.product.name : "No image set"), src:this.props.product.imageUrl}),
          React.createElement("div", {className:"form mb-3"},
            React.createElement("label", {for:"add-image-url-input"}, updateOrSet, " the image of this product"),
            React.createElement("input", {type:"text", className:"form-control", placeholder:"Upload it to a host like imgur or IPFS", id:"add-image-url-input"}),
            (this.props.id !== -1 &&
            React.createElement("button", {className:"btn btn-primary mt-2", onClick:this.addImageUrl}, "Update image url"))
          ),
          React.createElement("div", {className:"col"},
            /* TODO this doesn't seem useful anymore... decide on its fate
            (this.props.id !== -1 && React.createElement("div", {className:"row mt-2"},
              React.createElement("button", {className:"btn btn-info", onClick:() => this.sendMods(this.props.id)}, "Save All Changes At Once")
            )),*/
            (this.props.id === -1 && React.createElement("div", {className:"row mt-2"},
              React.createElement("button", {className:"btn btn-primary", onClick:() => this.releaseDetailedProduct()}, "Release Product")
            ))
          )
        ),
        React.createElement("div", {className:"col-md-8 mt-2 mt-md-0 pt-2"},
          React.createElement("h5", {}, this.props.product.name),
          React.createElement("div", {className:"row"},
            React.createElement("p", {className:"col-6"}, "Price: " + web3.fromWei(this.props.product.price, "ether") + " ETH"),
            (this.props.id !== -1 && React.createElement("p", {}, "Orders Received: " + this.props.product.ordersReceived))
          ),
          (this.props.id !== -1 && React.createElement("div", {className:"form row col-12 mb-3"},
            React.createElement("label", {for:"change-price-input"}, "Update the price of this product (in ETH)"),
            React.createElement("input", {type:"number", className:"form-control", id:"change-price-input"}),
            React.createElement("button", {className:"btn btn-primary mt-2 float-right", onClick:this.changePrice}, "Change price")
          )),
          React.createElement("div", {className:"popup-product-ov"},
            React.createElement("div", {className:"current-product-details"},
              (this.props.id !== -1 && React.createElement("div", {className:"row"},
                React.createElement("p", {className:"col-6"}, "For Sale: " + (this.props.product.forSale ? "Yes" : "No")),
                (this.props.product.forSale ?
                  React.createElement("button", {className:"btn btn-danger ml-2 mt-n2", onClick:this.delist}, "Delist")
                  : React.createElement("button", {className:"btn btn-primary ml-2 mt-n2", onClick:this.list}, "List")
                )
              )),
              (this.props.id === -1 && React.createElement("div", {className:"row"},
                React.createElement("div", {className:"form-group col-12"},
                  React.createElement("label", {htmlFor:"immediate-listing-input", className:""},
                    React.createElement("input", {type:"checkbox", className:"mr-3", id:"immediate-listing-input"}),
                    "List immediately?"
                  )
                )
              )),
              (this.props.id !== -1 && React.createElement("p", {}, "Description: " + this.props.product.description)),
              React.createElement("div", {className:"form row col-12 mb-3"},
                React.createElement("label", {for:"add-description-input"}, updateOrSet, " the description of this product"),
                React.createElement("textarea", {className:"form-control", placeholder:"Product details and assurances go here!", id:"add-description-input"}),
                (this.props.id !== -1 &&
                React.createElement("button", {className:"btn btn-primary mt-2 float-right", onClick:this.addDescription}, "Update description"))
              )
            ),
            React.createElement("div", {className:"col-12 mb-3"},
              React.createElement("h3", {className:"row"}, "Customer Inputs"),
              (this.props.id !== -1 && React.createElement("div", {},
                React.createElement("small", {className:"text-muted row"}, "The options a customer can select to customise their order, such as size"),
                this.renderConfigOptions(this.state.configurableOptions))),
              (this.props.id === -1 && React.createElement("div", {},
                React.createElement("small", {className:"text-muted row"}, "Give customers an option they can select to customise their order, such as size"),
                React.createElement("small", {className:"text-muted row"}, "You can add other ones once you release the product")
              ))
            ),
            React.createElement("div", {className:"mb-3"},
              React.createElement("h6", {className:""}, "Add a configurable option"),
              React.createElement("div", {className:"form-group"},
                React.createElement("label", {for:"new-config-name"}, "Name of the option"),
                React.createElement("input", {type:"text", id:"new-config-name", placeholder:"E.g. size", className:"form-control", value:this.state.newConfigName, onChange:this.updateNewConfigName}),
              ),
              React.createElement("div", {className:"", id:"key-val-input"},
                (this.state.newConfigFields.length > 0 && this.state.newConfigFields.map(this.renderNewConfigFields)),
                (this.state.newConfigFields.length == 0 && React.createElement("label", {}, "Add the available options below")),
                React.createElement("div", {className:"form-group"},
                  React.createElement("input", {type:"text", id:"new-config-option-input", className:"form-control", placeholder:"E.g. Women's Small"}),
                  React.createElement("button", {onClick:this.addNewConfigOption, className:"btn btn-info mt-2"}, "Add Option")
                )
        			),
              (this.props.id !== -1 &&
              React.createElement("button", {onClick:this.sendNewConfig, className:"btn btn-primary"}, "Send Configuration")),
            ),
            (this.props.id !== -1 && React.createElement("div", {},
              React.createElement("h3", {}, "Supply chain steps"),
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
              ((this.state.noMoreSteps && this.state.supplyChain.length == 0) &&
                React.createElement("p", {}, "No steps set for this product - add one via the form below")
              ),
              React.createElement("div", {className:"mb-3"},
                React.createElement("h6", {}, "Add a supply step to this product's supply chain"),
                React.createElement("label", {for:"new-supply-step-instructions-input"}, "Instructions for this step"),
                React.createElement("textarea", {id:"new-supply-step-instructions-input", className:"form-control", placeholder:"What do you need done when an order is received? Be sure to include how a supplier should use order-specific information if necessary."}),
                React.createElement("label", {for:"change-price-input"}, "Fee you will pay for this step (in ETH)"),
                React.createElement("input", {type:"number", id:"new-supply-step-fee-input", className:"form-control"}),
                React.createElement("button", {className:"btn btn-primary mt-2 mb-2 float-right", onClick:this.addSupplyStep}, "Add supply step")
              ),
              React.createElement("h3", {}, "Orders received"),
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
              (this.props.product.ordersReceived == 0 &&
                React.createElement("p", {}, "No orders received yet!")
              )
            )),
            (this.props.id === -1 && React.createElement("p", {}, "Once your product is released, you'll be able to see details like orders received and supply chain configurations here"))
          )
        )
      )
    );
  }

});

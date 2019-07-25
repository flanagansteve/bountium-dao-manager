// A constant for the amount of queries we want to do from the contract at a time
const productsPerFetch = 10;

var CatalogueOverview = React.createClass({

  getInitialState : function() {
    // upper lim on how many products to fetch from the biz
    // TODO is there some way to actually ask the contract "how many products do
    // you sell?" If not, there should be
    var productsStillToFetch = 100;
    return {
      catalogue : [],
      productsStillToFetch : productsStillToFetch,
      noMore : false,
      selectedProduct : -1,
      newProduct : {
        creating : false,
        name : "",
        price : 0
      }
    }
  },

  componentDidMount : function() {
    this.fetchProducts();
  },

  getProduct : function(productNum) {
    var catalogue = this.state.catalogue;
    this.props.autobiz.catalogue(productNum, (err, res) => {
      if (err) {
        if(err.message.includes("not a base 16")) {
          this.setState({noMore:true})
        } else {
          console.error(err)
        }
      } else {
        // Assumes no one is intentionally naming a product ""
        if (res[0] != "") {
          catalogue.push({
            name : res[0],
            description : res[1],
            imageUrl : res[2],
            forSale : res[3],
            price : res[4],
            ordersReceived : res[5],
            orderOptions : res[6]
          });
          this.setState({catalogue:catalogue});
        }
      }
    });
  },

  fetchProducts : function() {
    var i = 0;
    for (i; i < productsPerFetch; i++) {
      if (this.state.productsStillToFetch - i - 1 < 0) {
        break;
      }
      this.getProduct(this.state.catalogue.length + i);
    }
    this.setState({productsStillToFetch:this.state.productsStillToFetch -= i})
  },

  showProductOverview : function(productId) {
    this.setState({selectedProduct : productId})
    if (productId == -1)
      this.setState({newProduct : {
        creating:false
      }})
  },

  mapCatalogue : function(product, key) {
    return React.createElement(ProductCard, {
      key:key, product:product, id : key, renderProduct:this.showProductOverview
    });
  },

  releaseProduct : function() {
    this.props.autobiz.releaseProduct(
      document.getElementById("new-product-name").value,
      "No description set",
      "https://www.digitalcitizen.life/sites/default/files/styles/lst_small/public/featured/2016-08/photo_gallery.jpg",
      false,
      Number(web3.toWei(document.getElementById("new-product-price").value, 'ether')),
      "",
      (err, res) => {
        if (err)
          console.error(err)
        if (typeof res !== 'undefined') {
          alert("Your product is being sent to the contract now.");
          // Note: the new product's productID should be equal to the number of products in the catalogue
          var productReleased = this.props.autobiz.ProductReleased((err, res) => {
            // ignoring errors for now
            // if tx was confirmed:
            if (res) {
              alert("Success! View your new product in the catalogue");
              this.refreshCatalogue();
            } else {
              console.error(err);
              alert("Something went wrong when trying to release your product")
            }
          });
        }
      }
    )
  },

  modNewProduct : function() {
    this.setState({newProduct : {
      creating : true,
      name : document.getElementById("new-product-name").value,
      price : Number(web3.toWei(document.getElementById("new-product-price").value, 'ether'))
    }})
  },

  refreshCatalogue : function() {
    this.setState({selectedProduct : -1});
    this.setState({catalogue : []});
    this.fetchProducts();
    this.setState({newProduct : {
      creating : false,
      name : "",
      price : 0
    }})
  },

  render : function() {
    if (this.state.newProduct.creating)
      return React.createElement("div", {className:"container-fluid"},
        React.createElement("div", {className:"jumbotron bg-light"},
          React.createElement("h3", null, "Products and Sales"),
          React.createElement(ModifyProduct,
            {
              product : this.state.newProduct,
              autobiz : this.props.autobiz,
              id : -1,
              refreshCatalogue : this.refreshCatalogue,
              cancel:() => this.showProductOverview(-1)
            }
          )
        )
      );
    if (this.state.selectedProduct != -1)
      return React.createElement("div", {className:"container-fluid"},
        React.createElement("div", {className:"jumbotron bg-light"},
          React.createElement("h3", null, "Products and Sales"),
          React.createElement(ModifyProduct,
            {
              product : this.state.catalogue[this.state.selectedProduct],
              autobiz : this.props.autobiz,
              id : this.state.selectedProduct,
              refreshCatalogue : this.refreshCatalogue,
              cancel:() => this.showProductOverview(-1)
            }
          )
        )
      );
    if (this.state.catalogue.length != 0)
      return React.createElement("div", {className:"container-fluid"},
        React.createElement("div", {className:"jumbotron bg-light"},
          React.createElement("h3", null, "Products and Sales"),
          React.createElement("legend", {className:"col-12 mt-3 card-columns"},
            this.state.catalogue.map(this.mapCatalogue),
            React.createElement("div", {className:"card"},
              React.createElement("div", {className:"card-body"},
                React.createElement("h5", {}, "Release a New Product"),
                React.createElement("div", {className:"form"},
                  React.createElement("label", {for:"new-product-name", className:"custom-card-form-text"}, "Name your product"),
                  React.createElement("input", {type:"text", className:"form-control", id:"new-product-name"}),
                  React.createElement("label", {for:"new-product-price", className:"custom-card-form-text"}, "Price your product (in ETH)"),
                  React.createElement("input", {type:"number", className:"form-control", id:"new-product-price"}),
                  React.createElement("button", {className:"btn btn-primary mt-2", onClick:this.releaseProduct}, "Deploy"),
                  React.createElement("button", {className:"btn btn-info mt-2 ml-1", onClick:this.modNewProduct}, "Add more details"),
                  React.createElement("br", {}),
                  React.createElement("small", {className:"text-muted custom-card-form-text"}, "You can add other details once you deploy the product to your business's contract")
                )
              )
            )
          )
        )
      );
    return React.createElement("div", {className:"container-fluid"},
      React.createElement("div", {className:"jumbotron bg-light"},
        React.createElement("legend", null, "Products and Sales"),
        (!this.state.noMore && React.createElement("img", {className:"img-sm", src:"/img/loading.gif"})),
        (this.state.noMore && React.createElement("div", {className:"col-12 mt-3 card-columns"},
          React.createElement("div", {className:"card"},
            React.createElement("div", {className:"card-body"},
              React.createElement("h5", {}, "Release your First Product"),
              React.createElement("div", {className:"form"},
                React.createElement("label", {for:"new-product-name"}, "Name your product"),
                React.createElement("input", {type:"text", className:"form-control", id:"new-product-name"}),
                React.createElement("label", {for:"new-product-price"}, "Price your product (in ETH)"),
                React.createElement("input", {type:"number", className:"form-control", id:"new-product-price"}),
                React.createElement("button", {className:"btn btn-primary mt-2", onClick:this.releaseProduct}, "Deploy"),
                React.createElement("button", {className:"btn btn-info mt-2 ml-1", onClick:this.modNewProduct}, "Add more details"),
                React.createElement("br", {}),
                React.createElement("small", {className:"text-muted"}, "You can add other details once you deploy the product to your business's contract")
              )
            )
          )
        ))
      )
    );
  }

});

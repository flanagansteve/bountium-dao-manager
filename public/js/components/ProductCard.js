var ProductCard = React.createClass({

  renderProduct : function() {
    this.props.renderProduct(this.props.id);
  },

  order : function(productID) {
    this.props.autobiz.order(productID, document.getElementById("customer-info-input-" + productID).value,
      {from:userAccount, value:this.props.product.price},
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

  render : function() {
    return React.createElement("a", {href:"#", className:"link-unstyled"},
      React.createElement("div", {className:"card d-flex", onClick:this.renderProduct},
        React.createElement("img", {className:"card-img-top mx-auto d-block", alt:this.props.product.name, src:this.props.product.imageUrl}),
        React.createElement("div", {className:"container"},
          // TODO can we make the product name appear as a link w/o really being a link?
          React.createElement("h5", {onClick:this.renderProduct}, React.createElement("p", {className:"card-link"}, this.props.product.name)),
          React.createElement("p", {}, "Price: " + web3.fromWei(this.props.product.price, "ether") + " ETH"),
          React.createElement("p", {}, this.props.product.ordersReceived + " orders received"),
          React.createElement("button", {className:"btn btn-info mb-1", onClick:this.renderProduct}, "Manage")
        )
      )
    );
  }

});

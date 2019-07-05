var NotOwnerError = React.createClass({

  getInitialState : function() {
    return {
      xed:false
    }
  },

  x : function() {
    this.setState({xed:true});
    alertXed = true;
  },

  render : function() {
    if (this.state.xed)
      return React.createElement("div", {});
    var br = React.createElement("br", {});
    var xout = React.createElement("button", {className:"btn btn-primary",onClick:this.x, className:"popup-x-btn"}, "X");
    var header = React.createElement("h3", {}, this.props.children);
    var shopLink = location.href.replace("biz", "shop");
    if (!shopLink.includes(autobizAddr))
      if (shopLink.includes("?0x"))
        shopLink = shopLink.substring(0, shopLink.indexOf("?")) + "?" + autobizAddr;
      else
        shopLink += "?" + autobizAddr;
    return React.createElement("div", {className:"popup"},
      xout, header,
      React.createElement("h5", {}, "You are not registered as an owner of this autobiz"),
      br,
      React.createElement("p", {}, "If you meant to shop at this autobiz, follow this link: " + shopLink),
      br,
      React.createElement("p", {}, "Or, try re-typing the address of your autobiz - maybe you have the wrong one")
    );
  }
})

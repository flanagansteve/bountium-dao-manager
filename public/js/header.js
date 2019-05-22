var Header = React.createClass({

  render : function() {
    // TODO i'm sure theres a better way to do this
    if (location.href.includes("/biz") || location.href.includes("/supplier") || location.href.includes("/shop") || location.href.includes("/post") || location.href.includes("/tshirt"))
      return React.createElement("div", {className:"header"},
        React.createElement("ul", {},
          React.createElement("a", {href:"../"}, React.createElement("img", {src:"../img/logo.png"})),
          React.createElement("li", {}, React.createElement("a", {href:"../biz/"}, "Manage Business")),
          React.createElement("li", {}, React.createElement("a", {href:"../shop/"}, "Shop")),
          React.createElement("li", {}, React.createElement("a", {href:"../supplier/"}, "Fulfill Supply Requests"))
        )
      );
      return React.createElement("div", {className:"header"},
        React.createElement("ul", {},
          React.createElement("a", {href:"./"}, React.createElement("img", {src:"./img/logo.png"})),
          React.createElement("li", {}, React.createElement("a", {href:"./biz/"}, "Manage Business")),
          React.createElement("li", {}, React.createElement("a", {href:"./shop/"}, "Shop")),
          React.createElement("li", {}, React.createElement("a", {href:"./supplier/"}, "Fulfill Supply Requests"))
        )
      );
  }

});

window.onload = function() {
  ReactDOM.render(
    React.createElement(Header, {}),
    document.getElementById("header")
  );
}

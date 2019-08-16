// TODO better welcome screen
// TODO header with welcome logo
window.addEventListener('load', async () => {
  ReactDOM.render(React.createElement(Navbar, {}), document.getElementById("navbar"))
  var br = React.createElement("br", {});
  ReactDOM.render(
    React.createElement("div", {className:"container-fluid"},
      React.createElement("h1", {}, "Welcome to the Bountium DAO Manager"),
      React.createElement("p", {}, "Bountium-powered DAOs are innovative tools for global, easy commerce. By leveraging our platform, you can distribute equity in your business with ease, receive orders from around the world, and even configure your business to automatically manage its own inventory."),
      React.createElement("p", {}, "To use Bountium, you'll need to install ",
      React.createElement("a", {href : "https://metamask.io"}, "Metamask.")),
      React.createElement("div", {className:"row"},
        React.createElement("a", {href:"./new/", className:"link-unstyled col-sm-6"},
          React.createElement("div", {className:"card bg-primary text-white"},
            React.createElement("div", {className:"card-body"},
              React.createElement("h5", {className:"card-title"}, "New to Bountium?"),
              React.createElement("p", {className:"card-text"}, "Get started by creating your own Bountium-powered DAO")
            )
          )
        ),
        React.createElement("a", {href:"./biz/", className:"link-unstyled col-sm-6"},
          React.createElement("div", {className:"card bg-success text-white"},
            React.createElement("div", {className:"card-body"},
              React.createElement("h5", {className:"card-title"}, "Returning?"),
              React.createElement("p", {className:"card-text"}, "Log in and manage your Bountium-powered DAO")
            )
          )
        )
      )
    ),
    document.getElementById("dashboard")
  );
});

// Override alert function to use _B_ootstrap
window.alert = function(text) {
  ReactDOM.render(
    React.createElement("div", {className:"alert alert-warning alert-dismissible fade show", role:"alert", id:"to-dismiss"},
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
}

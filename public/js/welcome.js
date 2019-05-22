// TODO better welcome screen
// TODO header with welcome logo
window.addEventListener('load', async () => {
  var br = React.createElement("br", {});
  ReactDOM.render(
    React.createElement("div", {className:"welcome-user-options"},
      React.createElement("h1", {}, "Welcome to Bountium"),
      React.createElement("p", {}, "To use Bountium, you'll need to install ",
      React.createElement("a", {href : "https://metamask.io"}, "Metamask.")),
      React.createElement("p", {}, "To use the example autobizs, set Metamask to the Ropsten test network."),
      br,
      React.createElement("a", {href:"./shop/"}, "I want to shop at an autobiz"),
      br, br,
      React.createElement("a", {href:"./biz/"}, "I want to manage or create an autobiz"),
      br, br,
      React.createElement("a", {href:"./supplier/"}, "I am a supplier who wants to fulfill autobiz requests")
    ),
    document.getElementById("dashboard")
  );
});

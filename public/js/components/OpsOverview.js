var OpsOveriew = React.createClass({

  render : function() {
    return React.createElement("div", {className:"container-fluid"},
      React.createElement("h5", {}, "Coming soon!"),
      React.createElement("p", {}, "Soon, you'll be able to see operational efficiency, establish new partnerships, and manage labour - outsourced and internal - from this screen"),
      React.createElement("p", {}, "For now, you can visit the ",
        React.createElement("a", {href:"http://market.bountium.org/post"}, "marketplace interface"),
       " and make posts from your personal Ethereum account to get jobs done"
      )
    );
  }

});

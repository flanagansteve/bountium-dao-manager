var Navbar = React.createClass({

  render : function() {
    return React.createElement("header", {className:"navbar navbar-expand"},
        React.createElement("a", {href:"/", className:"navbar-brand mr-0 mr-md-2"},
          React.createElement("img", {src:"/img/logo.png", className:"navbar-img"}),
        ),
        React.createElement("div", {className:"col-11 mx-auto"},
          React.createElement("ul", {className:"nav navbar-collapse"},
            React.createElement("li", {className:"nav-item ml-auto"}, React.createElement("a", {href:"/new", className:"nav-link"}, "Start a Business")),
            React.createElement("li", {className:"nav-item"}, React.createElement("a", {href:'/biz', className:"nav-link"}, "Manage your Business"))
          )
        )
      );
  }

});

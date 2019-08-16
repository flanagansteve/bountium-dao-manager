var OrgOverview = React.createClass({

  getInitialState : function() {
    var modListener = this.props.autobiz.OwnershipModified((err, res) => {
      if (res) {
        // TODO this presumes other owners won't modify the org while this user is online
        alert("Ownership changes confirmed.");
        this.setState({owners : []})
        this.getOrgInfo();
      }
    })
    return {
      shares : 0,
      totalShares : 0,
      dividend : false,
      dilute : false,
      bestow : false,
      modifyCatalogue : false,
      owners : [],
      orgFunds : 0
    }
  },

  componentDidMount : function() {
    this.getOrgInfo();
  },

  getOrgInfo : function() {
    // TODO how to get total number of owners?? presuming ten. perhaps a button
    // to get ten at a time?
    var maxOwners = 10;
    // TODO can i speed this up? delays load.
    for (let i = 0; i < maxOwners; i++)
      this.props.autobiz.ownersRegistered(i, (err, res) => {
        if (err)
          console.error(err);
        var owners = this.state.owners;
        if (res != "0x")
          owners.push(res);
        this.setState({owners:owners})
      });
    this.props.autobiz.owners(userAccount, (err, res) => {
      if(err)
        console.error(err)
      if (res) {
        this.setState({shares : res[0]});
        this.setState({dividend : res[1]});
        this.setState({dilute : res[2]});
        this.setState({bestow : res[3]});
        this.setState({modifyCatalogue : res[4]});
      }
    });
    this.props.autobiz.totalShares( (err, res) => {
      if (err)
        console.error(err);
      this.setState({totalShares : res.c[0]});
    });
    web3.eth.getBalance(this.props.autobiz.address, (err, res) => {
      if (err)
        console.error(err);
      this.setState({orgFunds:res});
    })
    this.setState({expanded:true});
  },

  callDividend : function() {
    this.props.autobiz.payDividend(document.getElementById("dividend-amt-input").value, (err, res) => {
      if (err)
        console.error(err);
      alert("Your dividend of " +
        (document.getElementById("dividend-amt-input").value * this.state.shares)
        + " wei is on its way!"
      );
    });
  },

  fundBiz : function() {
    web3.eth.sendTransaction(
      {
        from : userAccount,
        to : this.props.autobiz.address,
        value : document.getElementById("org-funding-amt-input").value
      }, function(err, res) {
        if (err)
          console.error(err)
        alert("Your funding is on its way - Metamask will notify you when the tx is confirmed. You will then be able to refresh to see the changes reflected here");
      }
    )
  },

  transfer : function() {
    this.props.autobiz.transferShares(
      document.getElementById("transfer-shares-amt-input").value,
      document.getElementById("transfer-shares-addr-input").value,
      function(err, res) {
        if(err)
          console.error(err)
        alert("Your request is on its way!")
      }
    );
  },

  dilute : function() {
    this.props.autobiz.dilute(
      document.getElementById("dilute-shares-amt-input").value,
      document.getElementById("dilute-shares-addr-input").value,
      function(err, res) {
        if(err)
          console.error(err)
        alert("Your request is on its way!")
      }
    );
  },

  givePermission : function() {
    this.props.autobiz.bestowPermission(
      document.getElementById("bestow-permission-addr-input").value,
      Number(document.getElementById("bestow-permission-id-input").value),
      function(err, res) {
        if(err)
          console.error(err)
        alert("Your request is on its way!")
      }
    );
  },

  mapOwners : function(owner, key) {
    // TODO have each addr link to popup with info about their ownership role
    // currently just links to etherscan
    if (owner != "0x")
      return React.createElement("div", {key:key},
        React.createElement("a",
          {
            className:"owner-link",
            href:"https://ropsten.etherscan.io/address/" + owner
          },
          owner
        ),
        React.createElement("br", {})
      );
    return null;
  },

  render : function() {
    // if total shares is 0 then we haven't gotten org info
    if (this.state.totalShares == 0)
      return React.createElement("div", {className:"container-fluid"},
        React.createElement("img", {className:"img-sm", src:"/img/loading.gif"})
      );
    var ownership = React.createElement("div", {className:"jumbotron"},
      React.createElement("legend", null, "Ownership and shares"),
      React.createElement("p", null,
          "Your stake: " + this.state.shares + " shares of "
          + this.state.totalShares + " total shares, for a stake of "
          + ((this.state.shares / this.state.totalShares) * 100) + "%"
      ),
      React.createElement("p", {}, "Owners:"),
      this.state.owners.map(this.mapOwners),
      React.createElement("hr", {}),
      React.createElement("div", {className:"row"},
        React.createElement("div", {className:"col-6"},
          React.createElement("legend", {}, "Transfer your shares"),
          React.createElement("div", {className:"form"},
            React.createElement("label", {for:"transfer-shares-amt-input"}, "Amount of shares to transfer"),
            React.createElement("input", {type:"number", className:"form-control", id:"transfer-shares-amt-input"}),
            React.createElement("label", {for:"transfer-shares-addr-input"}, "Address of new owner"),
            React.createElement("input", {type:"text", className:"form-control", id:"transfer-shares-addr-input"}),
            React.createElement("button", {className:"btn btn-primary mt-2 mb-2",onClick:this.transfer}, "Transfer shares")
          )
        ),
        (this.state.dilute && React.createElement("div", {className:"col-6"},
          React.createElement("legend", {}, "Give new shares, diluting everyone's stakes"),
          React.createElement("div", {className:"form"},
            React.createElement("label", {for:"dilute-shares-amt-input"}, "Amount of shares to create and give"),
            React.createElement("input", {type:"number", className:"form-control", id:"dilute-shares-amt-input"}),
            React.createElement("label", {for:"dilute-shares-addr-input"}, "Address of new owner"),
            React.createElement("input", {type:"text", className:"form-control", id:"dilute-shares-addr-input"}),
            React.createElement("button", {className:"btn btn-primary mt-2",onClick:this.dilute}, "Create and give shares")
          )
        ))
      ),
      (this.state.bestow && React.createElement("div", {className:"row"},
        React.createElement("div", {className:"col-8"},
          React.createElement("legend", {}, "Bestow permissioned roles to a co-owner"),
          React.createElement("div", {className:"form"},
            React.createElement("label", {for:"bestow-permission-addr-input"}, "Co-owner's Ethereum address"),
            React.createElement("select", {className:"form-control", id:"bestow-permission-addr-input"},
              this.state.owners.map((owner, key) => owner != "0x" ? React.createElement("option", {value:owner, key:key}, owner) : null)
            ),
            React.createElement("label", {for:"bestow-permission-id-input"}, "Role"),
            React.createElement("select", {className:"form-control", id:"bestow-permission-id-input"},
              React.createElement("option", {value:1}, "Can call dividends"),
              React.createElement("option", {value:2}, "Can dilute shares"),
              React.createElement("option", {value:3}, "Can give permissions to other owners"),
              React.createElement("option", {value:4}, "Can modify and create products"),
            ),
            React.createElement("button", {className:"btn btn-primary mt-2",onClick:this.givePermission}, "Give permission")
          )
        )
      ))
    );
    var orgFundsDiv = React.createElement("div", {className:"col-6"},
      React.createElement("legend", {}, "Send funds to the organisation"),
      React.createElement("div", {className:"form"},
        React.createElement("p", {}, "Current organisation balance: " + web3.fromWei(this.state.orgFunds, "ether") + " ETH"),
        React.createElement("label", {for:"org-funding-amt-input"}, "Amount to send organisation, in wei"),
        React.createElement("input", {type:"number", className:"form-control", id:"org-funding-amt-input"}),
        React.createElement("button", {className:"btn btn-primary mt-2", onClick:this.fundBiz}, "Send funds")
      )
    );
    return React.createElement("div", {className:"container-fluid"},
      React.createElement("div", {className:"org-info-and-actions"},
        ownership,
        React.createElement("div", {className:"jumbotron bg-light"},
          React.createElement("div", {className:"row"},
            orgFundsDiv,
            (this.state.dividend && React.createElement("div", {className:"col-6 float-right"},
              React.createElement("legend", null, "Call for a new dividend"),
              React.createElement("div", {className:"form"},
                React.createElement("label", {for:"dividend-amt-input"}, "Wei per share: "),
                React.createElement("input", {type:"number", className:"form-control", id:"dividend-amt-input"}),
                React.createElement("button", {className:"btn btn-primary mt-2", onClick:this.callDividend}, "Call for a dividend")
              )
            ))
          )
        )
      )
    );
  }

});

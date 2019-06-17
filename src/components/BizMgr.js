import React from 'react';

export default class BizMgr extends React.Component {

  mapOwners() {

  }

  fundBiz() {

  }

  render() {
    var br = React.createElement("br", {});
    /*
    shares : 0,
    totalShares : 0,
    dividend : false,
    dilute : false,
    bestow : false,
    modifyCatalogue : false,
    board : false,
    owners : owners_,
    expanded : false,
    orgFunds : 0
    */
    var giveUS, dilute, bestow = null;
    if (this.props.biz.dilute) {
      giveUS = React.createElement("div", {},
        React.createElement("h5", {}, "Give unallocated shares:"),
        React.createElement("div", {className:"org-mgmt-form"},
          React.createElement("label", {for:"give-shares-amt-input"}, "Amount of shares to give: "),
          React.createElement("input", {type:"number", id:"give-shares-amt-input"}),
          br, br,
          React.createElement("label", {for:"give-shares-addr-input"}, "Address of new owner: "),
          React.createElement("input", {type:"text", id:"give-shares-addr-input"}),
          br, br,
          React.createElement("button", {onClick:this.giveUnallocated}, "Give shares")
        )
      );
      dilute = React.createElement("div", {},
        React.createElement("h5", {}, "Give new shares, diluting current owners' stakes:"),
        React.createElement("div", {className:"org-mgmt-form"},
          React.createElement("label", {for:"dilute-shares-amt-input"}, "Amount of shares to create and give: "),
          React.createElement("input", {type:"number", id:"dilute-shares-amt-input"}),
          br, br,
          React.createElement("label", {for:"dilute-shares-addr-input"}, "Address of new owner: "),
          React.createElement("input", {type:"text", id:"dilute-shares-addr-input"}),
          br, br,
          React.createElement("button", {onClick:this.dilute}, "Create and give shares")
        )
      );
      bestow = React.createElement("div", {},
        React.createElement("h5", {}, "Bestow permissioned roles to a co-owner:"),
        React.createElement("p", {}, "Role IDs are assigned as follows:"),
        React.createElement("ul", {}, "1. can call dividend"),
        React.createElement("ul", {}, "2. can dilute shares"),
        React.createElement("ul", {}, "3. can bestow permissions to others"),
        React.createElement("ul", {}, "4. can modify the catalogue"),
        React.createElement("ul", {}, "5. is a board member"),
        React.createElement("div", {className:"org-mgmt-form"},
          React.createElement("label", {for:"give-permission-id-input"}, "Role ID: "),
          React.createElement("input", {type:"number", id:"give-permission-id-input"}),
          br, br,
          React.createElement("label", {for:"give-permission-addr-input"}, "Address of bestowee: "),
          React.createElement("input", {type:"text", id:"give-permission-addr-input"}),
          br, br,
          React.createElement("button", {onClick:this.givePermission}, "Give permission")
        )
      );
    }
    var ownership = React.createElement("div", {className:"org-mgmt-section"},
      React.createElement("h4", null, "Ownership and shares"),
      React.createElement("p", null,
          "Your stake: " + this.props.biz.shares + " shares of "
          + this.props.biz.totalShares + " total shares, for a stake of "
          + ((this.props.biz.shares / this.props.biz.totalShares) * 100) + "%"
      ),
      React.createElement("p", {}, "Owners:"),
      this.props.biz.owners.map(this.mapOwners),
      React.createElement("h5", {}, "Transfer your shares:"),
      React.createElement("div", {className:"org-mgmt-form"},
        React.createElement("label", {for:"transfer-shares-amt-input"}, "Amount of shares to transfer: "),
        React.createElement("input", {type:"number", id:"transfer-shares-amt-input"}),
        br, br,
        React.createElement("label", {for:"transfer-shares-addr-input"}, "Address of new owner: "),
        React.createElement("input", {type:"text", id:"transfer-shares-addr-input"}),
        br, br,
        React.createElement("button", {onClick:this.transfer}, "Transfer shares")
      ),
      giveUS,
      dilute,
      bestow
    );
    var orgFundsDiv = React.createElement("div", {className:"org-mgmt-section"},
      React.createElement("h4", null, "Organisation funds"),
      React.createElement("p", null, "Current organisation balance: " + this.props.biz.orgFunds + " wei"),
      React.createElement("h5", {}, "Send funds to the organisation"),
      React.createElement("div", {className:"org-mgmt-form"},
        React.createElement("label", {for:"org-funding-amt-input"}, "Amount to send organisation, in wei: "),
        React.createElement("input", {type:"number", id:"org-funding-amt-input"}),
        br, br,
        React.createElement("button", {onClick:this.fundBiz}, "Send funds")
      )
    );
    var dividendCall = null;
    if (this.props.biz.dividend)
      dividendCall = React.createElement("div", {className:"org-mgmt-section"},
        React.createElement("h4", null, "Dividends"),
        React.createElement("h5", null, "Call for a new dividend"),
        React.createElement("div", {className:"org-mgmt-form"},
          React.createElement("label", {for:"dividend-amt-input"}, "Wei per share: "),
          React.createElement("input", {type:"number", id:"dividend-amt-input"}),
          br, br,
          React.createElement("button", {onClick:this.callDividend}, "Call for a dividend")
        )
      );
    return React.createElement("div", {className:"organisation-mgr"},
      React.createElement("h3", null, "Your Organisation"),
      React.createElement("div", {className:"org-info-and-actions"},
        ownership, br, br,
        orgFundsDiv, br, br,
        dividendCall
      )
    );
  }
}

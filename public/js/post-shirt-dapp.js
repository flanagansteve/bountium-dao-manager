// This is an interface specifically for posting T-shirt orders as a beachhead
// use-case of Bountium. The current recommended test market is at:
  // 0xe748d6628cb4f0e87c48509b227b82f831411733
// TODO this really should import from post-dapp.js, but I couldn't get that
// working right! argh

incentiviserABI = web3.eth.contract([{"constant":true,"inputs":[],"name":"oracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"settle","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"fund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bounties","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_oracle","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);

assessorABI = web3.eth.contract([{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "viewBountyInfo","outputs": [{"name": "bountyInfo","type": "bytes"},{"name": "infoType","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "completed","outputs": [{"name": "completed_","type": "bool"},{"name": "completer","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "bountyID","type": "uint256"},{"name": "claim","type": "bytes"}],"name": "respond","outputs": [{"name": "received","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "data","type": "bytes"}],"name": "submit","outputs": [{"name": "received","type": "bool"},{"name": "bountyID","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"anonymous": false,"inputs": [{"indexed": false,"name": "bountyID","type": "uint256"},{"indexed": false,"name": "sender","type": "address"}],"name": "RequestReceived","type": "event"}]);

incentiviser = null;
assessor = null;

window.addEventListener('load', async () => {
  // check for metamask
  if(typeof web3 !== 'undefined') {
    await ethereum.enable();
    web3 = new Web3(web3.currentProvider);
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  try {
    userAccount = web3.eth.accounts[0];
    updateInterface();
    var accountInterval = setInterval(function() {
      if (web3.eth.accounts[0] !== userAccount) {
        userAccount = web3.eth.accounts[0];
        updateInterface();
      }
    }, 100);
  } catch (e) {
    console.error(e);
  }
});

function updateInterface() {
	document.getElementById("workflow-container").innerHTML = "";
  var addr = location.search;
  if (addr.includes("market=0x")) {
		// presuming its a valid incent addr... TODO
		incentiviser = incentiviserABI.at(addr.substring(addr.indexOf("market=") + "market=".length, addr.indexOf("market=") + "market=".length + 42));
    incentiviser.oracle((err, res) => {
      if (err)
        console.error(err)
      assessor = assessorABI.at(res);
      assessor.viewBountyInfo(0, (err, res) => {
        if (!err) {
    			ReactDOM.render(
    	      React.createElement(Dashboard,
              {
                incentAddr:incentiviser.address,
                dataType:res[1]
              }, userAccount
            ),
    	      document.getElementById("dashboard")
    	    );
        } else {
          // No bounties have been set for this market. TODO how, then, do we get
          // its data type? Just presuming a string for now...
          if (err.message.includes("not a base 16")) {
            ReactDOM.render(
      	      React.createElement(Dashboard, {incentAddr:incentiviser.address}, userAccount),
      	      document.getElementById("dashboard")
      	    );
          } else {
            console.error(err);
          }
        }
      });
    });
  } else {
    ReactDOM.render(
      React.createElement(Dashboard, {incentAddr:"0x"}, userAccount),
      document.getElementById("dashboard")
    );
  }
}

var Dashboard = React.createClass({

  getInitialState : function() {
    var name_ = "your business"
    // NOTE: to format right, the owner's name must be prepended by ", " if we have it
    var owner_ = "!"
    var mdt = "string"
    if (this.props.dataType != null)
      mdt = this.props.dataType;
    return {
      incentAddr : this.props.incentAddr,
      name : name_,
      owner : owner_,
      marketDataType : mdt
    }
  },

  setIncentAddr : function() {
    // TODO handle "invalid incent addr" error
    incentiviser = incentiviserABI.at(document.getElementById("incentiviser-addr-input").value);
    incentiviser.oracle((err, res) => {
      if (err)
        console.error(err)
      assessor = assessorABI.at(res);
      // get bounty data type
      assessor.viewBountyInfo(0, (err, res) => {
        if (!err) {
          this.setState({marketDataType:res[1]});
          this.setState({incentAddr:document.getElementById("incentiviser-addr-input").value});
        } else {
          // No bounties have been set for this market. TODO how, then, do we get
          // its data type? Just presuming a string for now...
          if (err.message.includes("not a base 16")) {
            this.setState({incentAddr:document.getElementById("incentiviser-addr-input").value});
          } else {
            console.error(err);
          }
        }
      })
    });
  },

  lookupIncentByKeyword : function() {
    // TODO
  },

  render : function() {
    var welcome = React.createElement("div", null,
      React.createElement("h2", null, "Welcome" + this.state.owner),
      React.createElement("h3", null, "Find the perfect market to post your task to.")
    );
    var br = React.createElement("br", {});
    // If an incentiviser has been selected
    if (this.state.incentAddr != "0x") {
      return React.createElement("div", null, welcome,
        React.createElement("div", {className:"supplier-dashboard"},
          React.createElement(IncentiviserOverview, {dataType:this.state.marketDataType})
        )
      );
    }
    return React.createElement("div", null, welcome,
      React.createElement("div", {className:"supplier-dashboard"},
        React.createElement("h3", {}, "Find an incentiviser"),
        React.createElement("div", {className:"incentiviser-search-form"},
          React.createElement("p", {}, "Example string incentiviser at: 0x450477fe993eb695f44027eda75652cd59f8cfc0"),
          React.createElement("p", {}, "Example json incentiviser at: 0xe748d6628cb4f0e87c48509b227b82f831411733"),
          React.createElement("label", {for:"incentiviser-addr-input"}, "Look incentiviser up by address"),
          br, br,
          React.createElement("input", {type:"text", id:"incentiviser-addr-input", placeholder:"0x123..."}),
          br,
          React.createElement("button", {onClick:this.setIncentAddr}, "Lookup incentiviser")
        ),
        React.createElement("div", {className:"incentiviser-search-form"},
          React.createElement("label", {for:"incentiviser-keyword-input"}, "Look incentiviser up by keyword"),
          br, br,
          React.createElement("input", {type:"text", id:"incentiviser-keyword-input", placeholder:"ie, \"Delivery\""}),
          br,
          React.createElement("button", {onClick:this.lookupIncentByKeyword}, "Lookup incentiviser")
        )
        // TODO show either most popular incents in table here, or search results
      )
    );
  }
});

var IncentiviserOverview = React.createClass({

  getInitialState : function() {
    var bounties_ = [];
    var viewedBounty_ = {
      bounty : 0,
      bountyID : -1,
      bountyData : null,
      completed : false,
      completer : "0x"
    }
    return {
      bounties : bounties_,
      viewedBounty : viewedBounty_
    }
  },

  sendBounty : function() {
    if (this.props.dataType == "jsonObj") {
      // TODO form a json obj from the input form
      var jsonOrderString = "do this steve"; //document.getElementById("bounty-info-input").value
      assessor.submit(stringToBytes(jsonOrderString),
        (err, res) => {
          if(err)
            console.error(err);
          else {
            alert("Your submission is on its way!");
            var confirmSubmission = assessor.RequestReceived((err, res) => {
              if (err)
                console.error(err);
              else {
                if (res.args.sender == userAccount) {
                  alert("Success - review your bounty on the right.");
                  this.getBountyById(res.args.bountyID);
                }
              }
            })
          }
        }
      );
    } else {
      // This view only works with json markets at the moment! Perhaps
      // in the future we will work with a "t-shirt" order data type
      alert("This interface only supports JSON-based orders");
    }
  },

  getBountyById : function(id) {
    var vq = this.state.viewedBounty;
    vq.bountyID = id;
    incentiviser.bounties(vq.bountyID, (err, res) => {
      if (err)
        console.error(err)
      else
        vq.bounty = res
    });
    assessor.completed(vq.bountyID, (err, res) => {
      if (err) {
        console.error(err)
      } else {
        vq.completed = res[0];
        if (res[0])
          vq.completer = res[1];
      }
    });
		assessor.viewBountyInfo(vq.bountyID, (err, res) => {
			if (err) {
				if(err.message.includes("not a base 16")) {
					vq.bountyData = stringToBytes("No bounty set with this ID on this incentiviser");
					vq.dataType = "string";
					this.setState({viewedBounty:vq});
				} else {
					console.error(err);
				}
			} else {
        vq.bountyData = res[0];
        vq.dataType = res[1];
        this.setState({viewedBounty:vq});
      }
		});
  },

  getBounty : function() {
    var vq = this.state.viewedBounty;
    vq.bountyID = document.getElementById("bounty-id-input").value;
    incentiviser.bounties(vq.bountyID, (err, res) => {
      if (err)
        console.error(err)
      else
        vq.bounty = res
    });
    assessor.completed(vq.bountyID, (err, res) => {
      if (err) {
        console.error(err)
      } else {
        vq.completed = res[0];
        if (res[0])
          vq.completer = res[1];
      }
    });
		assessor.viewBountyInfo(vq.bountyID, (err, res) => {
			if (err) {
				if(err.message.includes("not a base 16")) {
					vq.bountyData = stringToBytes("No bounty set with this ID on this incentiviser");
					vq.dataType = "string";
					this.setState({viewedBounty:vq});
				} else {
					console.error(err);
				}
			} else {
        vq.bountyData = res[0];
        vq.dataType = res[1];
        this.setState({viewedBounty:vq});
      }
		});
  },

  render : function() {
    // at init:
      // on left:
        // form to look up existing bounty
        // form to create new bounty
    // once bounty submitted/looked up:
      // on left:
        // form to look up existing bounty
        // form to create new bounty
      // on right:
        // status of this bounty with ID, latest actions, completion status,
        // button for funding, and button for taking action on it (ie vote)
        // and (down the line) a button for sharing it
		var header = React.createElement("h3", {}, "Welcome to market: " + incentiviser.address);
		var br = React.createElement("br", {});
    var lookupForm = React.createElement("div", {className : "bounty-lookup-form"},
			React.createElement("label", {for:"bounty-id-input"}, "Look a bounty up by ID"),
			br,
			React.createElement("input", {type:"number", id:"bounty-id-input"}),
			br,
			React.createElement("button", {onClick:this.getBounty}, "Look up")
		);
		var submissionForm;
    if (this.props.dataType == "jsonObj")
      // TODO steve make a form here
      submissionForm = React.createElement("div", {className : "bounty-lookup-form"},
  			React.createElement("label", {for:"bounty-info-input"}, "Submit a new bounty to this incentiviser market"),
  			br,
  			React.createElement("input", {type:"text", id:"bounty-info-input", placeholder:"Instructions here..."}),
  			br,
  			React.createElement("button", {onClick:this.sendBounty}, "Submit")
  		);
    else
      // Currently only handling JSON data type markets
      submissionForm = React.createElement("div", {className : "bounty-lookup-form"},
        React.createElement("p", {}, "We are only currently supporting JSON-based incentivisers - try this one: 0xe748d6628cb4f0e87c48509b227b82f831411733")
      );
    if (this.state.viewedBounty.bountyID == -1)
      return React.createElement("div", {className:"incentiviser-overview"},
				header,
				submissionForm,
        lookupForm
      );
    if (!this.state.viewedBounty.completed)
      return React.createElement("div", {className:"incentiviser-overview"},
				header,
				React.createElement(BountySubmissionPopup, {bounty:this.state.viewedBounty}),
				submissionForm,
        lookupForm
      );
    return React.createElement("div", {className:"incentiviser-overview"},
			header,
      React.createElement(BountyReviewPopup, {bounty:this.state.viewedBounty}),
			submissionForm,
      lookupForm
    );
  }
});

var BountySubmissionPopup = React.createClass({

  submit : function() {
		var response = null;
		if (this.props.bounty.dataType == "string" || this.props.bounty.dataType == "jsonObj")
			response = stringToBytes(document.getElementById("bounty-response-input").value);
		else
			response = intToBytes(document.getElementById("bounty-response-input").value);
    assessor.respond(
      this.props.bounty.bountyID,
      response,
      function(err, res) {
        if (err)
          console.error(err)
        alert("Your response is on its way! Come back later and look the bounty up again to see if it was marked as completed.")
      }
    )
  },

  // converts a JSON pair of key : imageUrl to a div with the label and
  // rendered img
  keyValToImgDiv : function(labelAndUrl, key) {
    return React.createElement("div", {key:key},
      React.createElement("p", {}, labelAndUrl[0]),
      React.createElement("img", {src:labelAndUrl[1], className:"supplier-instructions-img"})
    );
  },

  strToP : function(str, key) {
    return React.createElement("p", {key:key}, str);
  },

  render : function() {
  	var bountyInstructions = null;
  	if (this.props.bounty.dataType == "jsonObj") {
  		// TODO handle json parsing error here - likely malformed
  		var dataObj = JSON.parse(bytesToString("" + this.props.bounty.bountyData));
      var imgsArr = [];
  		var instructionsArr = [];
  		for (var key in dataObj) {
  			if (dataObj.hasOwnProperty(key)) {
          try {
            // if one of the params is an image url, render properly
            if (
              dataObj[key].substr(dataObj[key].length - 4) == ".jpg" ||
              dataObj[key].substr(dataObj[key].length - 4) == ".png" ||
              dataObj[key].substr(dataObj[key].length - 5) == ".jpeg"
            ) {
              imgsArr.push([key, dataObj[key]]);
            } else {
      				instructionsArr.push(key + " : " + dataObj[key]);
            }
          } catch (e) {
            instructionsArr.push(key + " : " + dataObj[key]);
          }
  			}
  		}
  		bountyInstructions = React.createElement("div", {}, imgsArr.map(this.keyValToImgDiv), instructionsArr.map(this.strToP));
  	} else {
  		var bountyData = null;
  		if (this.props.bounty.dataType == "string")
  			bountyData = bytesToString("" + this.props.bounty.bountyData);
  		else
  			bountyData = bytesToInt(this.props.bounty.bountyData);
  		bountyInstructions = React.createElement("p", {}, "Relevant data/instructions: " + bountyData);
  	}
		var input = React.createElement("input", {type:"number", id:"bounty-response-input"});
		if (this.props.bounty.dataType == "string" || this.props.bounty.dataType == "jsonObj") {
			input = React.createElement("input", {type:"text", placeholder:"Follow this market's instructions to submit evidence of completion", id:"bounty-response-input"});
		} else {
			bountyData = bytesToInt(this.props.bounty.bountyData);
		}
		if (bountyData == "No bounty set with this ID on this incentiviser")
			return React.createElement("div", {className:"bounty-submission"},
				React.createElement("p", {}, "Order id: " + this.props.bounty.bountyID),
				React.createElement("p", {}, "Payment Available: " + this.props.bounty.bounty + " wei"),
				React.createElement("p", {}, "Relevant data/instructions: " + bountyData)
			);
    return React.createElement("div", {className:"bounty-submission"},
      React.createElement("p", {}, "Order id: " + this.props.bounty.bountyID),
      React.createElement("p", {}, "Payment Available: " + this.props.bounty.bounty + " wei"),
      bountyInstructions,
      React.createElement("p", {}, "Completed: No"),
      React.createElement("div", {className:"bounty-response-form"},
        React.createElement("label", {for:"bounty-response-input"}, "Submit a response to this bounty"),
        React.createElement("br", {}),
				input,
        React.createElement("br", {}),
				React.createElement("button", {onClick:this.submit}, "Submit")
      )
    );
  }
});

var BountyReviewPopup = React.createClass({

  settle : function() {
    incentiviser.settle(this.props.bounty.bountyID, function(err, res) {
      if (err)
        console.error(err)
      alert("the payment request is on its way. Watch your wallet!")
    })
  },

  // converts a JSON pair of key : imageUrl to a div with the label and
  // rendered img
  keyValToImgDiv : function(labelAndUrl, key) {
    return React.createElement("div", {key:key},
      React.createElement("p", {}, labelAndUrl[0]),
      React.createElement("img", {src:labelAndUrl[1], className:"supplier-instructions-img"})
    );
  },

  strToP : function(str, key) {
    return React.createElement("p", {key:key}, str);
  },

  render : function() {
  	var bountyInstructions = null;
  	if (this.props.bounty.dataType == "jsonObj") {
      // TODO handle json parsing error here - likely malformed
  		var dataObj = JSON.parse(bytesToString("" + this.props.bounty.bountyData));
      var imgsArr = [];
  		var instructionsArr = [];
  		for (var key in dataObj) {
  			if (dataObj.hasOwnProperty(key)) {
          try {
            // if one of the params is an image url, render properly
            if (
              dataObj[key].substr(dataObj[key].length - 4) == ".jpg" ||
              dataObj[key].substr(dataObj[key].length - 4) == ".png" ||
              dataObj[key].substr(dataObj[key].length - 5) == ".jpeg"
            ) {
              imgsArr.push([key, dataObj[key]]);
            } else {
      				instructionsArr.push(key + " : " + dataObj[key]);
            }
          } catch (e) {
            instructionsArr.push(key + " : " + dataObj[key]);
          }
  			}
  		}
  		bountyInstructions = React.createElement("div", {}, imgsArr.map(this.keyValToImgDiv), instructionsArr.map(this.strToP));
  	} else {
  		var bountyData = null;
  		if (this.props.bounty.dataType == "string")
  			bountyData = bytesToString("" + this.props.bounty.bountyData);
  		else
  			bountyData = bytesToInt(this.props.bounty.bountyData);
  		bountyInstructions = React.createElement("p", {}, "Relevant data/instructions: " + bountyData);
  	}
  	return React.createElement("div", {className:"bounty-submission"},
  		React.createElement("p", {}, "Bounty id: " + this.props.bounty.bountyID),
  		React.createElement("p", {}, "Bounty Available: " + this.props.bounty.bounty + " wei"),
  		bountyInstructions,
  		React.createElement("p", {}, "Completed: Yes, by " + this.props.bounty.completer),
  		React.createElement("button", {onClick:this.settle}, "Pay out")
  	);
  }
});

function intToBytes(int) {
  var result = Math.abs(int).toString(16);
  while(result.length < 64)
    result = "0" + result;
  return "0x" + result;
}

function stringToBytes(string) {
  var result = '';
  for (var i=0; i<string.length; i++)
    result += ''+string.charCodeAt(i).toString(16);
	while (result.length < 64)
		result += "0"
  return "0x" + result;
}

function bytesToString(bytes) {
  var bytes = "" + bytes;
  var result = '';
  for (var i = 0; i < bytes.length; i+=2)
    if (bytes.substr(i, 2) != "00" && bytes.substr(i, 2) != "0x")
    	result += String.fromCharCode(parseInt(bytes.substr(i, 2), 16));
  return result;
}

function bytesToInt(bytes) {
	return Number(bytes);
}

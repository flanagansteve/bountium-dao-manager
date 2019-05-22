// TODO incorporate registrar
  // for keyword search
  // just a table of popular ones to choose from
// TODO let a supplier set up a profile with their name + history. perhaps
// set them up with a contract?
// TODO we are currently getting the data type of a market by calling viewBountyInfo
// on the market's 0th bounty. This allows us to:
	// present the proper input type for the submission text field
	// parse viewBountyInfo correctly
// however, this fails if a contract has no bounties yet. you could:
	// mod contract to deploy a default bounty on construction
	// mod contract to document its data type at interface level
	// have user specify the data type if no bounties are available
	// pull data type from registrar
// this issue becomes more complex as you consider markets with many specs - see
// next TODO
// TODO add the following order fields to the bounty overview:
	// Due date
	// contact info
	// Some item-specific specs; for t shirts, for example:
		// quantity
		// colour
		// sizes
		// style
		// artwork
// You may be able to accomplish this by passing the info as a long string, allowing
// you to keep the contract's submit() the same, and parsing that string on the front
// end. However, this would require your front end to know the conventions of the
// order-specs string for each market, something that likely won't scale well.
// You could:
 	// do the nonscalable "long string + hardcoded front end parsing" solution just
	// in the test stage, and kick the can down the road
		// Pro: easy, keeps contract release stable
		// Con: does not scale, is hacky, may fail easily
	// add functions for adding more fields about a bounty, and let markets
	// with less specs ignore them
		// Pro: more scalable than last, still pretty easy
		// Con: Ignoring null specs may be hard/impossible on front end, and this still
		// 			has limited scalability - what specs may i be missing?
	// have markets self-document their parsing conventions as a template, and
	// have front end pull template and somehow figure out how to parse viewBountyInfo
		// Pro: scales very well
		// Con: Still not great design, requires very complex parsing on front end
	// use registrar somehow? TODO
	// TODO how else can i approach this???
// TODO convert the award to US Dollars
// TODO more elegantly present fields of JSON object returned from a market with type
// jsonObj. For example, if one field contains a value ending in .jpg, try to render it
// as an image!
// TODO post-dapp and supplier-dapp should import the BountyReview/Submission react
// classes from another file to keep them in sync

// Example string-based bounty market at: 0x8e58b441aac850bec819cdaaf1bee4cf1298b031
// Example num-based bounty market at: 0x64d083eb98f69555ce813fa2528735e9d09f990a

incentiviserABI = web3.eth.contract([{"constant":true,"inputs":[],"name":"oracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"settle","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"bountyID","type":"uint256"}],"name":"fund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bounties","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_oracle","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);

assessorABI = web3.eth.contract([{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "viewBountyInfo","outputs": [{"name": "bountyInfo","type": "bytes"},{"name": "infoType","type": "string"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "bountyID","type": "uint256"}],"name": "completed","outputs": [{"name": "completed_","type": "bool"},{"name": "completer","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "bountyID","type": "uint256"},{"name": "claim","type": "bytes"}],"name": "respond","outputs": [{"name": "received","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "data","type": "bytes"}],"name": "submit","outputs": [{"name": "received","type": "bool"},{"name": "bountyID","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"}]);

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
      if (addr.includes("bounty=")) {
        ReactDOM.render(
  	      React.createElement(Dashboard,
            {incentAddr:incentiviser.address, urlBounty:addr.substring(addr.indexOf("bounty=") + "bounty=".length)},
          userAccount),
  	      document.getElementById("dashboard")
  	    );
      } else {
  			ReactDOM.render(
  	      React.createElement(Dashboard, {incentAddr:incentiviser.address, urlBounty:-1}, userAccount),
  	      document.getElementById("dashboard")
  	    );
      }
    });
  } else {
    ReactDOM.render(
      React.createElement(Dashboard, {incentAddr:"0x", urlBounty:-1}, userAccount),
      document.getElementById("dashboard")
    );
  }
}

var Dashboard = React.createClass({

  getInitialState : function() {
    var name_ = "your business"
    var owner_ = "Business Owner"
    return {
      incentAddr : this.props.incentAddr,
      name : name_,
      owner : owner_
    }
  },

  setIncentAddr : function() {
    // TODO handle "invalid incent addr" error
    incentiviser = incentiviserABI.at(document.getElementById("incentiviser-addr-input").value);
    incentiviser.oracle((err, res) => {
      if (err)
        console.error(err)
      assessor = assessorABI.at(res);
      this.setState({incentAddr:document.getElementById("incentiviser-addr-input").value});
    });
  },

  lookupIncentByKeyword : function() {
    // TODO
  },

  render : function() {
    // Header: Logo, Welcome msg w/ user's name, profile:
      // profile: balance, button to see popup of past attempted bounties
        // Within popup, if a bounty is clicked: BountyReviewPopup (see below)
    // Incentiviser view:
      // Initially: Form to look up an incentiviser by addr and see available bounties
      //            Form to look up incentiviser's by keyword
      //            Feed of [initially] most popular bounties, [or] search results
      // If incentiviser selected, IncentiviserOverview:
        // a. method of assessment and addr of assessor
        // b. available bounties, perchance sorted by size?
        // c. search for a bounty by orderID
    // Bounty view:
      // If this bounty has not been attempted, BountySubmissionPopup:
        // a. once a bounty is picked, popup with details: specs, submitter (with prof link),
        //    bounty, status, date of submission
        // b. fields to submit response evidence
      // if it has been attempted, BountyReviewPopup
        // a. display their response, status
        //    (if applicable - for example, "awaiting approval" or "in voting")
        // b. btn to try to settle
    var logo;// = React.createElement("img", {src:"./img/logo.png", href:"./index.html"});
    var welcome = React.createElement("div", null,
      React.createElement("h2", null, "Welcome, " + this.state.owner),
      React.createElement("h3", null, "Search up an incentiviser market by address to get to work.")
    );
    var br = React.createElement("br", {});
    var prof = React.createElement(SupplierProfile, {}, this.props.children);
    // If an incentiviser has been selected
    if (this.state.incentAddr != "0x")
      return React.createElement("div", null, logo, welcome, prof,
        React.createElement("div", {className:"supplier-dashboard"},
          React.createElement(IncentiviserOverview, {urlBounty:this.props.urlBounty})
        )
      );
    return React.createElement("div", null, logo, welcome, prof,
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

// TODO
var SupplierProfile = React.createClass({
  render : function() {
    return null;
  }
});

var IncentiviserOverview = React.createClass({

  getInitialState : function() {
    var bounties_ = [];
    var viewedBounty_ = {
      bounty : 0,
      bountyID : this.props.urlBounty,
      bountyData : null,
      completed : false,
      completer : "0x"
    }
    return {
      bounties : bounties_,
      viewedBounty : viewedBounty_,
      detailsMatchID : false
    }
  },

  updateBountyDetails : function() {
    var vq = this.state.viewedBounty;
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
        this.setState({detailsMatchID:true});
      }
		});
  },

  updateBountyID : function() {
    var vq = this.state.viewedBounty;
    vq.bountyID = document.getElementById("bounty-id-input").value;
    this.setState({viewedBounty:vq});
    this.setState({detailsMatchID:false});
  },

  render : function() {
		var header = React.createElement("h3", {}, "Welcome to market: " + incentiviser.address);
		var br = React.createElement("br", {});
		var lookupForm = React.createElement("div", {className : "bounty-lookup-form"},
			React.createElement("label", {for:"bounty-id-input"}, "Look a bounty up by ID"),
			br,
			React.createElement("input", {type:"number", id:"bounty-id-input"}),
			br,
			React.createElement("button", {onClick:this.updateBountyID}, "Look up")
		);
    if (this.state.viewedBounty.bountyID == -1)
      return React.createElement("div", {className:"incentiviser-overview"},
				header,
				lookupForm
      );
    if (!this.state.detailsMatchID)
      this.updateBountyDetails();
    if (!this.state.viewedBounty.completed)
      return React.createElement("div", {className:"incentiviser-overview"},
				header,
				React.createElement(BountySubmissionPopup, {bounty:this.state.viewedBounty}),
				lookupForm
      );
    return React.createElement("div", {className:"incentiviser-overview"},
			header,
      React.createElement(BountyReviewPopup, {bounty:this.state.viewedBounty}),
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
      React.createElement("img", {src:labelAndUrl[1], className:"supplier-instructions-img"}),
      React.createElement("p", {}, "Link to downloadable image: ", React.createElement("a", {href:labelAndUrl[1]}, labelAndUrl[1]))
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
      React.createElement("img", {src:labelAndUrl[1], className:"supplier-instructions-img"}),
      React.createElement("p", {}, "Link to downloadable image: ", React.createElement("a", {href:labelAndUrl[1]}, labelAndUrl[1]))
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
  		React.createElement("p", {}, "Order id: " + this.props.bounty.bountyID),
  		React.createElement("p", {}, "Payment Available: " + this.props.bounty.bounty + " wei"),
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

// TODO figure this out
function weiToUSD(weiAmt) {

  var usd = web3.fromWei(weiAmt);
  // using this or the native fetch() generates a blocked CORS - must this
  // be done server side? would really like to keep the dapp self sovereign
  // so anyone with the front end codebase can run it.
  /*
  $.get("https://api.coinmarketcap.com/v1/ticker/ethereum", function(data, status) {
    usd *= data.price_usd;
  });
  */

  alert(usd);
  return usd;
}

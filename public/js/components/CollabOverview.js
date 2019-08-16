// TODO put lines 1-21 in separate message service, in exportable manner
let fetchHost = "http://localhost:8080"
// let fetchHost = "https://shielded-mesa-96501.herokuapp.com";

sendMessage = (message, bizId) =>
  fetch(`${fetchHost}/api/businesses/${bizId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json'
      }
  })
  .then(response => response.json());

// ------------------------------------------------------------------------------------

// expects a list of messages, ie, the messages field of a business
getMessagesForBusiness = (bizId) =>
  fetch(`${fetchHost}/api/businesses/${bizId}/messages`).then(response => response.json());

var CollabOverview = React.createClass({

  getInitialState : function() {
    return {
      msgs : [],
      err : false
    }
  },

  componentDidMount : function() {
    this.fetchMsgs();
  },

  fetchMsgs : function() {
    getMessagesForBusiness(this.props.autobiz.address)
      .then(response => {
        if (Array.isArray(response)) {
          this.setState({err : false})
          this.setState({msgs : response})
        } else {
          this.setState({err : true})
        }
      }
    )
  },

  sendMsg : function() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    let msg = {
      content : document.getElementById("new-message").value,
      timestamp : dateTime,
      sender : this.props.userAccount
    };
    sendMessage(msg, this.props.autobiz.address)
      .then(response => {
        if (Array.isArray(response)) {
          this.setState({msgs : response})
          this.setState({err : false})
        } else {
          this.setState({err : true})
        }
      }
    );
    document.getElementById("new-message").value = "";
  },

  renderMessages : function(msg, key) {
    return React.createElement("div", {className:"row " + (key % 2 == 0 ? "bg-white" : "bg-light"), id:"msg-" + key, key:key},
      React.createElement("p", {className:"col-sm-3"}, msg.sender.substring(0, 15) + "..."),
      React.createElement("p", {className:"col-sm-7"}, msg.content),
      React.createElement("p", {className:"col-2"}, msg.timestamp)
    );
  },

  render : function() {
    return React.createElement("div", {className:"container-fluid"},
      React.createElement("div", {className:"mh-100 overflow-auto"},
        React.createElement("h4", {}, "Chat"),
        !this.state.err && React.createElement("div", {className:"messages"}, this.state.msgs.map(this.renderMessages)),
        this.state.err && React.createElement("div", {className:""}, "Error fetching messages from the server - try again later"),
        React.createElement("div", {className:"form-group"},
          React.createElement("input", {id:"new-message", placeholder:"Type a new message...", type:"text", className:"form-control mb-1"}),
          React.createElement("button", {onClick:this.sendMsg, className:"btn btn-primary"}, "Send"),
          React.createElement("button", {onClick:this.fetchMsgs, className:"btn btn-primary float-right"}, "Refresh")
        )
      )
    );
  }


});

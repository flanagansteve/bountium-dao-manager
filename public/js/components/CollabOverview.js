// TODO put lines 1-21 in separate message service, in exportable manner

let fetchHost = "https://shielded-mesa-96501.herokuapp.com";

sendMessage = (message, bizId) =>
  fetch(`${fetchHost}/api/businesses/${bizId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        'content-type': 'application/json'
      }
  })
  //.then(res => console.log(res))
  .then(response => response.json());

// ------------------------------------------------------------------------------------

// expects a list of messages, ie, the messages field of a business
getMessagesForBusiness = (bizId) =>
  fetch(`${fetchHost}/api/businesses/${bizId}/messages`).then(response => response.json());

var CollabOverview = React.createClass({

  getInitialState : function() {
    return {
      msgs : []
    }
  },

  componentDidMount : function() {
    this.fetchMsgs();
  },

  fetchMsgs : function() {
    getMessagesForBusiness(this.props.autobiz.address)
      .then(response => this.setState({msgs : response}))
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
      .then(response => this.setState({msgs : response}));
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
    console.log(this.state.msgs)
    return React.createElement("div", {className:"container-fluid"},
      React.createElement("h4", {}, "Chat"),
      React.createElement("div", {className:"messages"}, this.state.msgs.map(this.renderMessages)),
      React.createElement("div", {className:"form-group"},
        React.createElement("input", {id:"new-message", placeholder:"Type a new message...", type:"text", className:"form-control mb-1"}),
        React.createElement("button", {onClick:this.sendMsg, className:"btn btn-primary"}, "Send"),
        React.createElement("button", {onClick:this.fetchMsgs, className:"btn btn-primary float-right"}, "Refresh")
      )
    );
  }


});

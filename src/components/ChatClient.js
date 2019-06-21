import React from 'react'
import MessageService from '../services/MessageService';

const msgService = MessageService.getInstance();

export default class ChatClient extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msgs : this.props.msgs
    }
    this.fetchMsgs = this.fetchMsgs.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
  }

  componentDidMount() {
    // TODO make an interval that fetches messages periodically here
    this.fetchMsgs();
  }

  fetchMsgs() {
    // TODO make this ask the api for the messages field of the business
    msgService.getMessages(this.props.bizId)
    .then(response => this.setState({msgs : response}))
    //this.setState({msgs:msgService.getMessages(this.props.bizId)})
    //this.setState({msgs:this.props.msgs})
  }

  sendMsg() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    let msg = {
      content: document.getElementById("new-message").value,
      timestamp: dateTime,
      sender:this.props.sender
    };
    msgService.sendMessage(msg, this.props.bizId)
    .then(response => this.setState({msgs : response}));
    document.getElementById("new-message").value = "";
  }

  renderMessages(msg, key) {
    return <div className="row" id = {"msg-" + key} key={key}>
      <p className="col-2">{msg.sender}</p>
      <p className="col-8">{msg.content}</p>
      <p className="col-2">{msg.timestamp}</p>
    </div>
  }

  render() {
    return (
      <div className="container-fluid">
        <h4>Chat</h4>
        <div className="messages">
          {this.state.msgs.map(this.renderMessages)}
        </div>
        <div className="form-group">
          <input id="new-message"
                 placeholder="Type a new message..."
                 type="text"
                 className="form-control mb-1"/>
          <button onClick={this.sendMsg} className="btn btn-primary">Send</button>
          <button onClick={this.fetchMsgs} className="btn btn-primary float-right">Refresh</button>
        </div>
      </div>
    );
  }

}

import React from 'react'
import MessageService from '../services/MessageService';

const msgService = MessageService.getInstance();

export default class ChatClient extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      msgs : [{sender:'Loading...', content:'Loading...', timestamp:0}]
    }
    this.fetchMsgs = this.fetchMsgs.bind(this);
  }

  componentDidMount() {
    this.fetchMsgs();
  }

  fetchMsgs() {
    msgService.getMessages(this.props.bizId).then(response => this.setState({msgs : response}));
    // this.setState({msgs:msgService.getMessages(this.props.bizId)})
  }

  renderMessages(msg, key) {
    return <div className="row" id = {"msg-" + key} key={key}>
      <p className="col-2">{msg.sender}</p>
      <p className="col-9">{msg.content}</p>
      <p className="col-1">{msg.timestamp}</p>
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

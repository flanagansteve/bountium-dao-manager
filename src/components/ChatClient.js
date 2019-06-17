import React from 'react'
import MessageService from '../services/UserService';

const msgService = MessageService.getInstance();

export default class ChatClient extends React.Component {

  renderMessages (msg, key) {
    return <div className="d-inline" id = {"msg-" + key} key={key}>
      <p>{msg.sender}</p>
      <p>{msg.content}</p>
      <p>{msg.timestamp}</p>
    </div>
  }

  render() {
    return <div>
      {/*msgService.getMessages(this.props.bizId).map(this.renderMessages)*/}
      <input id="new-message"
             placeholder="Type a new message..."
             type="text"/>
      <button onClick={this.sendMsg} className="btn btn-primary">Send</button>
    </div>
  }

}

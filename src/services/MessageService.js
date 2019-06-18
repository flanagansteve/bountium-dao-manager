var fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  fetchHost = "https://guarded-tundra-80923.herokuapp.com";
}

export default class MessageService {

    static myInstance = null;
    static getInstance() {
      if (MessageService.myInstance == null) {
        MessageService.myInstance = new MessageService();
      }
      return this.myInstance;
    }

    // Wants to push a message onto the array of messages within a biz
    sendMessage = (message, bizId) => {
      fetch(`${fetchHost}/api/business/${bizId}/messages`, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());
    }

    // expects a list of messages, ie, the messages field of a business
    getMessages = (bizId) =>
      fetch(`${fetchHost}/api/business/${bizId}/messages`).then(response => response.json());
}

var fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  apiUrl = "https://guarded-tundra-80923.herokuapp.com";
}

export default class MessageService {

    static myInstance = null;
    static getInstance() {
      if (MessageService.myInstance == null) {
        MessageService.myInstance = new MessageService();
      }
      return this.myInstance;
    }

    sendMessage = (message, bizId) =>
      fetch(`${fetchHost}/api/message/${bizId}`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    getMessages = (bizId) =>
        fetch(`${fetchHost}/api/message${bizId}`).then(response => response.json());
}

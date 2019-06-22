let fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  fetchHost = "https://bountium-user-server.herokuapp.com";
}

export default class MessageService {

    static myInstance = null;
    static getInstance() {
      if (MessageService.myInstance == null) {
        MessageService.myInstance = new MessageService();
      }
      return this.myInstance;
    }

    // =======================================================================================

    // Wants to push a message onto the array of messages within a biz
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
}

var fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  fetchHost = "https://guarded-tundra-80923.herokuapp.com";
}

export default class BusinessService {

    static myInstance = null;
    static getInstance() {
      if (BusinessService.myInstance == null) {
        BusinessService.myInstance = new BusinessService();
      }
      return this.myInstance;
    }

    // Sends a biz object with all requisite fields to create a new one
    createBiz = (biz) =>
      fetch(`${fetchHost}/api/business/`, {
        method: 'POST',
        body: JSON.stringify(biz),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    // Send a new biz object with updated fields
    // TODO one day this should only be callable by a permissioned owner
    updateBiz = (newBiz, bizId) =>
      fetch(`${fetchHost}/api/business/${bizId}`, {
        method: 'PUT',
        body: JSON.stringify(newBiz),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    // Retrieve a business object
    // TODO one day this should only return most info if the user is a co owner
    getBiz = (bizId) =>
      fetch(`${fetchHost}/api/business/${bizId}`)
        .then(response => response.json());

}

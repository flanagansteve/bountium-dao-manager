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
    createOwnerForBiz = (owner, bizId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/owners`, {
        method: 'POST',
        body: JSON.stringify(owner),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    getOwnersForBiz = (bizId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/owners/`)
        .then(response => response.json());

    updateOwnerForBiz = (bizId, ownerIndex, newOwner) =>
      fetch(`${fetchHost}/api/businesses/${bizId}/owners/${ownerIndex}`, {
        method: 'PUT',
        body: JSON.stringify(newOwner),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

}

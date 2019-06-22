let fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  fetchHost = "https://bountium-user-server.herokuapp.com";
}

// Services for managing businesses on the website
export default class BusinessService {

    static myInstance = null;
    static getInstance() {
      if (BusinessService.myInstance == null) {
        BusinessService.myInstance = new BusinessService();
      }
      return this.myInstance;
    }

    //==============================================================================

    // Sends a biz object with all requisite fields to create a new one
    createBiz = (biz) =>
      fetch(`${fetchHost}/api/businesses/`, {
        method: 'POST',
        body: JSON.stringify(biz),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    //----------------------------------------------------------------------------

    // Send a new biz object with updated fields
    // TODO one day this should only be callable by a permissioned owner
    updateBiz = (newBiz, bizId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}`, {
        method: 'PUT',
        body: JSON.stringify(newBiz),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    //--------------------------------------------------------------------------

    // Retrieve a business object
    // TODO one day this should only return most info if the user is a co owner
    getBiz = (bizId) =>
      fetch(`${fetchHost}/api/businesses/${bizId}`)
        .then(response => response.json());

    //-------------------------------------------------------------------------

    // Gets all businesses in the database
    getAllBusinesses = () =>
      fetch(`${fetchHost}/api/businesses/`)
        .then(response => response.json());

}

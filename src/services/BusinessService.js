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

    createBiz = (biz) =>
      fetch(`${fetchHost}/api/business/`, {
        method: 'POST',
        body: JSON.stringify(biz),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    updateBiz = (newBiz, bizId) =>
      fetch(`${fetchHost}/api/business/${bizId}`, {
        method: 'PUT',
        body: JSON.stringify(newBiz),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

}

var fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  fetchHost = "https://guarded-tundra-80923.herokuapp.com";
}

export default class UserJobsService {


    static myInstance = null;

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance =
                new UserJobsService();
        }
        return this.myInstance;
    }

    postInternalJob = (newJob) =>
      fetch(`${fetchHost}/api/injobs`, {
        method: 'POST',
        body: JSON.stringify(newJob),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    getInternalJobsById = (userId) =>
      fetch(`${fetchHost}/api/users/${userId}/injobs`)
        .then(response => response.json());

    getExternalJobsById = (userId) =>
      fetch(`${fetchHost}/api/users/${userId}/exjobs`)
        .then(response => response.json());

    addUserToExJob = (jobId, userId) =>
      fetch(`${fetchHost}/api/exjobs/${jobId}/users/${userId}`)
        .then(response => response.json());

}

let fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
  fetchHost = "https://bountium-user-server.herokuapp.com";
}

export default class InternalJobsService {


    static myInstance = null;

    static getInstance() {
        if (this.myInstance == null) {
            this.myInstance =
                new InternalJobsService();
        }
        return this.myInstance;
    }

    //===========================================================================

    // Creates a new InternalJob
    postInternalJob = (newJob) =>
      fetch(`${fetchHost}/api/injobs`, {
        method: 'POST',
        body: JSON.stringify(newJob),
        headers: {
          'content-type': 'application/json'
        }
      }).then(response => response.json());

    // --------------------------------------------------------------------------

    // Gets a given Internal Job using its id
    getInternalJobsById = (userId) =>
      fetch(`${fetchHost}/api/users/${userId}/injobs`)
        .then(response => response.json());

    // -------------------------------------------------------------------------

    // Gets all of the Internal Jobs in the database
    getAllInternalJobs = () =>
        fetch(`${fetchHost}/api/injobs`)
            .then(response => response.json());

    //--------------------------------------------------------------------------

    // Adds a User many to many relationship with an internal job
    addUserToInJob = (jobId, userId) =>
        fetch(`${fetchHost}/api/injobs/${jobId}/users/${userId}`)
            .then(response => response.json());

}

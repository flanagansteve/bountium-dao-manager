let fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
    fetchHost = "https://bountium-user-server.herokuapp.com";
}

// Services for the External Jobs from Github
export default class ExternalJobsSearchService {

    static myInstance = null;

    static getInstance() {
        if (ExternalJobsSearchService.myInstance == null) {
            ExternalJobsSearchService.myInstance =
                new ExternalJobsSearchService();
        }
        return this.myInstance;
    }

    //========================================================================

    // Searches the third party Github Api for jobs
    searchJobApi = (keywords) => {

        let url = "https://cors-anywhere.herokuapp.com/http://jobs.github.com/positions.json?description=";


        let wordSplit = keywords.split(" ");
        for (let i = 0; i < wordSplit.length; i++) {
            if (i === 0) {
                url = url + wordSplit[i];
            } else {
                url = url + "+" + wordSplit[i];
            }
        }

        return fetch(url)
            .then(res => res.json())
            .then(json => json.valueOf())
    };

    //================================================================================

    // Adds a external Github job to our database.
    addJobToDatabase = (job) => {
        return fetch(`${fetchHost}/api/exjobs/`, {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json());
    };

    //-----------------------------------------------------------------------------------

    // Adds a User to an External Job many to many relationship.
    addUserToJob = (jobId, userId) => {
        return fetch(`${fetchHost}/api/exjobs/${jobId}/users/${userId}`)
            .then(response => response.json());
    };

    //-----------------------------------------------------------------------------------

    // Gets the corresponding External jobs in a many to many relationship with the given user.
    getJobsForUser = (userId) => {
        return fetch(`${fetchHost}/api/users/${userId}/exjobs`)
            .then(response => response.json());
    };

}
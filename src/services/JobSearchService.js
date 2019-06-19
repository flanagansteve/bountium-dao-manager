let fetchHost = "http://localhost:8080";

if (window.location.href.includes("heroku")) {
    fetchHost = "https://guarded-tundra-80923.herokuapp.com";
}

export default class JobSearchService {

    static myInstance = null;

    static getInstance() {
        if (JobSearchService.myInstance == null) {
            JobSearchService.myInstance =
                new JobSearchService();
        }
        return this.myInstance;
    }


    searchJobApi = (keywords) => {

        let url = "https://cors-anywhere.herokuapp.com/http://jobs.github.com/positions.json?description=";


        let wordSplit = keywords.split(" ");
        for(let i  = 0 ; i < wordSplit.length; i++) {
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

    addJobToDatabase = (job) => {
        fetch(`${fetchHost}/api/jobs/`, {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json());
    };
}

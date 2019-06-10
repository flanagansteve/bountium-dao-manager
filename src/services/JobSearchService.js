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
}

export default class JobSearchService {


    static myInstance = null;


    static getInstance() {
        if (JobSearchService.myInstance == null) {
            JobSearchService.myInstance =
                new JobSearchService();
        }
        return this.myInstance;
    }

    /*
    searchJobApi = (keywords) => {

        let url = "https://jobs.github.com/positions.json?description="
        let wordSplit = keywords.split(" ");
        for(let i  = 0 ; i < wordSplit.length; i++) {
            if (i === 0) {
                url = url + wordSplit[i];
            } else {
                url = url + "+" + wordSplit[i];
            }
        }

        //return fetch(url, {mode: 'cors'})
        //    .then(res => res.json())
        //    .then(json => console.log(json))

        $.ajax({
          url: url,
          type: "GET",
          dataType: "jsonp",
          success: function (data) {
            console.log(data);
            // and other stuff i do with the data i get
          },
          xhrFields: {
            withCredentials: false
          }
        });

     }*/



    // http://www.dice.com/external/content/documentation/api.html

    // look at documentation above and see if you can figure out the authorization

    searchJobApi = (keywords) => {

        return fetch("https://secure.dice.com/oauth/token", {
            method: 'POST',
            body: {
                'key': 'grant_type',
                'value': 'client_credentials'
            },
            headers: {
                'content-type': 'application/json',
                'application-type': 'x-www-form-urlencoded'
            }
        })
            .then(
                response =>
                    response.json());


    }



}

import $ from '../../node_modules/jquery/dist/jquery'

//import googleTrends from '../../node_modules/google-trends-api/lib/google-trends-api.min'

let googleTrends = require('../../node_modules/google-trends-api/lib/google-trends-api.min.js');

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


        let url = 'https://api.builtwith.com/trends/v6/api.json?KEY=770b5ccb-49b9-4c7f-a93a-8ce28ed974f9&TECH=Python';
        //let url = "https://jobs.github.com/positions.json?description="

        /*
        let wordSplit = keywords.split(" ");
        for(let i  = 0 ; i < wordSplit.length; i++) {
            if (i === 0) {
                url = url + wordSplit[i];
            } else {
                url = url + "+" + wordSplit[i];
            }
        }



         */

        /*
        url += '?app_id=adf56df2';
        url += "&app_key=3d7a89d3eb759fa1583a2ca890403f79";
        url+= "&s=Batman";


*/
        return fetch(url)
            .then(res => res.json)
            .then(json => console.log(json.Search));

        //return fetch(url, {mode: 'cors'})
        //    .then(res => res.json())
        //    .then(json => console.log(json))




        /*
        $.ajax({
          url: url,
          type: "GET",
          dataType: "json",
            data: 'dataStream',
          success: function (data) {
            console.log(data);
            // and other stuff i do with the data i get
          },
          xhrFields: {
            withCredentials: false
          }
        });

         */

        /*

        googleTrends.interestOverTime({keyword: 'Valentines Day'})
            .then((res) => {
                console.log('this is res', res);
            })
            .catch((err) => {
                console.log('got the error', err);
                console.log('error message', err.message);
                console.log('request body',  err.requestBody);
        });


     };


    /*

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

*/


    }





}

import React from 'react'

// TODO why are bootstrap classes not working?


export default class JobDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jobObj: null,
            internal: false
        }
    }

    getJob() {

        const pathSplit = window.location.href.split("/");
        const jobId = pathSplit[4];
        let url = "https://cors-anywhere.herokuapp.com/http://jobs.github.com/positions/";
        url += jobId;
        url += ".json";
        if (jobId.length <= 6 && !isNaN(Number(jobId))) {
          var fetchHost = "http://localhost:8080";
          if (window.location.href.includes("heroku")) {
            fetchHost = "https://guarded-tundra-80923.herokuapp.com";
          }
          url = fetchHost + "/api/injobs/" + jobId
        }
        fetch(url)
            .then(res => res.json())
            .then(json => {

                    console.log(json);
                    this.setState(
                        {
                            jobObj: json
                        }
                    )
                }
            )
    }

    render() {
        if (!this.state.jobObj) {
            this.getJob();
        }
        if (this.state.internal) {
          return ( <div>
            {this.state.jobObj &&
              <div className="jumbotron">
                <h1>{this.state.jobObj.title}</h1>
                <p>{this.state.jobObj.description}</p>
              </div>
            }
            </div>
          )
        }
        return (
            <div>
                {this.state.jobObj &&
                <div className="jumbotron">
                    <h1>{this.state.jobObj.title} - for: {this.state.jobObj.company_url != null &&
                    <a href={this.state.jobObj.company_url}>{this.state.jobObj.company}</a>}
                        {this.state.jobObj.company_url == null && this.state.jobObj.company}</h1>
                    <img src={this.state.jobObj.company_logo} className="float-right col-10" alt="accessible"/>
                    <h1>{this.state.jobObj.type}</h1>
                    <p>Posted at: {this.state.jobObj.created_at}</p>
                    <p>Location: {this.state.jobObj.location}</p>
                    <div dangerouslySetInnerHTML={{__html: this.state.jobObj.description}}/>
                    <div dangerouslySetInnerHTML={{__html: this.state.jobObj.how_to_apply}}/>
                </div>
                }
            </div>
        )
    }
}

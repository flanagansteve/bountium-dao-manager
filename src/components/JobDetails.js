import React from 'react'
import ExternalJobSearchService from '../services/ExternalJobSearchService'
import HTTPService from '../services/HTTPService'
import UserJobsService from '../services/UserJobsService'
import Alert from "react-bootstrap/Alert";
import {Link} from "react-router-dom";

const internalJobService = UserJobsService.getInstance();
const jobService = ExternalJobSearchService.getInstance();
const httpService = HTTPService.getInstance();

// TODO why are bootstrap classes not working?


export default class ExternalJobDetails extends React.Component {

    constructor(props) {
        super(props);

        const pathSplit = window.location.href.split("/");
        const jobId = pathSplit[4];

        this.state = {
            jobObj: null,
            jobId: jobId,
            loggedIn: null,
            userId: null,
            savedUsers: [],
            MustLoginAlert: false,
            internal: false
        }
    }

    //========================================================================

    getJob() {

        const pathSplit = window.location.href.split("/");
        const jobId = pathSplit[4];
        let url;

        let fetchHost = "http://localhost:8080";
        if (window.location.href.includes("heroku")) {
            fetchHost = "https://guarded-tundra-80923.herokuapp.com";
        }

        if (jobId.length <= 6 && !isNaN(Number(jobId))) {
            url = fetchHost + "/api/injobs/" + jobId;

            fetch(url)
                .then(res => res.json())
                .then(json => {

                        console.log(json);
                        this.setState(
                            {
                                jobObj: json,
                                savedUsers: json.internalSaves,
                                internal: true,
                            }
                        )
                    }
                )

        } else {

            let url2 = "https://cors-anywhere.herokuapp.com/http://jobs.github.com/positions/";
            url2 += jobId;
            url2 += ".json";

            fetch(url2)
                .then(res => res.json())
                .then(json => {
                        this.setState(
                            {
                                jobObj: json,
                            }
                        );

                        url = fetchHost + "/api/exjobs/" + jobId;

                        fetch(url)
                            .then(res => res.json())
                            .then(json => {
                                    this.setState(
                                        {
                                            savedUsers: json.externalSaves
                                        }
                                    );
                                }
                            );
                    }
                );
        }
    }

    //============================================================================


    checkIfLoggedIn() {
        httpService.receiveSessionProfile().then((profile) => {
            this.setState({
                loggedIn: (profile.username !== "null"),
                userId: profile.id
            });
        });
    }

    saveJobForUser() {
        if (this.state.loggedIn) {
            jobService.addUserToJob(this.state.jobObj.id, this.state.userId)
        } else {
            this.setState({
                MustLoginAlert: true
            })
        }
    };


    //===========================================================================

    handleDismiss() {
        this.setState({
            MustLoginAlert: false
        })
    }

    //=============================================================================

    renderJobObjUsers() {
        return this.state.savedUsers.map(
            function (item, index) {
                return <tr className="d-flex"
                           key={index}>
                    <Link to={`/profile/${item.id}`}
                          style={{color: 'black'}}>{item.username}</Link>
                </tr>;
            });
    }

    //================================================================================

    render() {

        if (this.state.loggedIn === null) {
            this.checkIfLoggedIn();
            this.getJob();
        }

        if (this.state.internal) {
            return (
                <div>
                    {this.state.jobObj &&
                    <div className="jumbotron">
                        <h1>{this.state.jobObj.title}</h1>
                        <p>{this.state.jobObj.description}</p>
                    </div>
                    }
                </div>
            )
        } else {
            return (
                <div>

                    {this.state.MustLoginAlert &&
                    <Alert variant='warning' onClose={() => this.handleDismiss()} dismissible>
                        Must be logged in to save a job to your profile </Alert>
                    }

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

                        <button className="btn btn-block btn-primary"
                                onClick={() => this.saveJobForUser()}>
                            Add User
                        </button>
                        <table>
                            <thead>
                            <tr className="d-flex">
                                Users who also saved this Job
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderJobObjUsers()}
                            </tbody>
                        </table>
                    </div>
                    }
                </div>
            )
        }
    }
}

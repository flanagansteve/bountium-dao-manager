import React from 'react'
import ExternalJobSearchService from '../services/ExternalJobSearchService'
import HTTPService from '../services/HTTPService'
import Alert from "react-bootstrap/Alert";
import {Link} from "react-router-dom";

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
            MustLoginAlert: false
        }
    }

    //========================================================================

    getJob() {

        const pathSplit = window.location.href.split("/");
        const jobId = pathSplit[4];

        let url = "https://cors-anywhere.herokuapp.com/http://jobs.github.com/positions/";

        url += jobId;
        url += ".json";
        fetch(url)
            .then(res => res.json())
            .then(json => {
                    this.setState(
                        {
                            jobObj: json
                        }
                    )
                }
            );
    }

    getUsers() {
        jobService.getUsersForJob(this.state.jobId).then( (users) => {
            console.log(users);
                this.setState({
                    savedUsers: users
                })
            }
        )
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
        console.log(this.state.savedUsers);
        return this.state.savedUsers.map(
            function (item, index) {
                return <tr className="d-flex"
                           key={index}>
                    <Link to={`/profile/${item.id}`}
                          style={{color: 'black'}}>{item.username}</Link>
                </tr>;
            });
    }

    render() {

        if (!this.state.jobObj) {
            this.getJob();
            this.getUsers();
            this.checkIfLoggedIn();
        }

        return (
            <div>

                {this.state.MustLoginAlert &&
                <Alert variant='warning' onClose={() => this.handleDismiss()} dismissible>
                    Need to be logged in to save a job </Alert>}

                {this.state.jobObj &&
                <div className="jumbotron">
                    <h1>{this.state.jobObj.title} - for: {this.state.jobObj.company_url != null &&
                    <a href={this.state.jobObj.company_url}>{this.state.jobObj.company}</a>}
                        {this.state.jobObj.company_url == null && this.state.jobObj.company}</h1>
                    <img src={this.state.jobObj.company_logo} className="float-right"/>
                    <h1>{this.state.jobObj.type}</h1>
                    <p>Posted at: {this.state.jobObj.created_at}</p>
                    <p>Location: {this.state.jobObj.location}</p>
                    <div dangerouslySetInnerHTML={{__html: this.state.jobObj.description}}/>
                    <div dangerouslySetInnerHTML={{__html: this.state.jobObj.how_to_apply}}/>

                    <button className="btn btn-block btn-primary"
                            onClick={() => this.saveJobForUser()}>
                        Add User </button>
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


import React from 'react';
import Alert from "react-bootstrap/Alert";
import {Link} from "react-router-dom";
import BountyMgr from '../businesses/BountyMgr'
import ExternalJobsSearchService from '../../services/ExternalJobsSearchService'
import HTTPService from '../../services/HTTPService'

const externalJobsService = ExternalJobsSearchService.getInstance();
const httpService = HTTPService.getInstance();

export default class JobSearchList extends React.Component {

    constructor(props) {
        super(props);
        const pathSplit = window.location.href.split("/");
        const jobKeyword = pathSplit[4];

        this.state = (
            {
                keywords: jobKeyword,
                jobList: null,
                savedJobs : [],
                savedJobsIds: [],
                userId: null,
                loggedIn: null,
                addedJobs: false,
                MustLoginAlert: false
            }
        );

        this.renderJobList = this.renderJobList.bind(this);
        this.saveJob = this.saveJob.bind(this);
    }

    //======================================================================================

    addJobsToDatabase() {
        for(let i = 0; i < this.state.jobList.length; i++){
            externalJobsService.addJobToDatabase(this.state.jobList[i])
        }
    }

    //-------------------------------------------------------------------------------------

    getJobs() {
        let url = "https://cors-anywhere.herokuapp.com/http://jobs.github.com/positions.json?description=";

        let wordSplit = this.state.keywords.split(" ");
        for (let i = 0; i < wordSplit.length; i++) {
            if (i === 0) {
                url = url + wordSplit[i];
            } else {
                url = url + "+" + wordSplit[i];
            }
        }

        fetch(url)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    jobList: json
                })
            })
    }

    //-----------------------------------------------------------------------------------------

    getExternalJobs() {
        this.setState({
            LookedForJobs: true
        });

        if (this.state.userId !== null) {
            externalJobsService.getJobsForUser(this.state.userId).then((jobsArr) => {
                this.setState({savedJobs: jobsArr})
            })
        }
    }

    //====================================================================================

    saveJob(e) {

        if(this.state.loggedIn) {
            console.log("Hello");
            externalJobsService.addUserToJob(e.target.id, this.state.userId);
            let sj = this.state.savedJobsIds;
            sj.push(e.target.id);
            this.setState({savedJobsIds: sj})
        } else {
            this.setState({
                MustLoginAlert: true
            })
        }
    }

    //====================================================================================

    checkIfLoggedIn() {
        httpService.receiveSessionProfile().then((profile) => {
            this.setState({
                loggedIn: (profile.username !== "null"),
                userId: profile.id
            });
        });
    }

    //---------------------------------------------------------------------------------

    handleDismiss() {
        this.setState({
            MustLoginAlert: false
        })
    }

    //================================================================================

    renderJobList() {
        if (this.state.loggedIn === null) {
            this.getJobs();
            this.checkIfLoggedIn();
        } else if (this.state.jobList && !this.state.addedJobs) {
            this.setState({
                addedJobs: true
            });
            this.addJobsToDatabase();
            this.getExternalJobs();
        } else if (this.state.jobList) {
            return this.state.jobList
                .map((item, index) => {
                    let alreadySaved = false;
                    if (this.state.loggedIn) {
                        alreadySaved = this.state.savedJobs.filter((job) => job.id === item.id).length > 0;
                    }
                    if (this.state.savedJobsIds.filter((jobId) => jobId === item.id).length > 0) {
                        alreadySaved = true;
                    }
                    return <tr className="d-flex" key={index}>
                        <td className="col-5">
                            <Link to={`/details/${item.id}`}
                                  style={{color: 'black'}}>{item.title}</Link></td>
                        <td className="col-5">
                            {item.company}
                        </td>
                        <td className="col-2">
                            {!alreadySaved &&
                              <button id={item.id} className="btn btn-primary" onClick={this.saveJob}>Save</button>}
                            {alreadySaved &&
                              <button className="btn btn-disabled" disabled>Saved</button>}
                        </td>
                    </tr>;
                });
        }
    }

    //=======================================================================================


    render() {
        if (this.state.jobList && this.state.jobList.length === 0) {
          return <div>
            <h1>No jobs with keyword '{this.state.keywords}' found</h1>
            <BountyMgr/>
          </div>
        }
        return (
            <div className="container-fluid">
                <h3> Job Search List for {this.state.keywords}
                </h3>
                {this.state.MustLoginAlert &&
                <Alert variant='warning' onClose={() => this.handleDismiss()} dismissible>
                    Must be logged in to save a job to your profile </Alert>
                }
                <table>
                    <thead>
                    <tr className="d-flex">
                        <th className="col-6">Title</th>
                        <th className="col-6">Company Name</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.renderJobList()}
                    </tbody>
                </table>
            </div>
        )
    }

}

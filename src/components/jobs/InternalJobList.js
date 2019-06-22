import React from 'react';
import {Link} from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import BountyMgr from '../businesses/BountyMgr'
import HTTPService from '../../services/HTTPService'
import InternalJobsService from '../../services/InternalJobsService'

const httpService = HTTPService.getInstance();
const internalJobsService = InternalJobsService.getInstance();



export default class InternalJobList extends React.Component {

    constructor(props) {
        super(props);
        this.state = (
            {
                jobList: null,
                savedJobs: [],
                savedJobsIds: [],
                userId: null,
                triedLoggingIn: false,
                loggedIn: null,
                addedJobs: false,
                MustLoginAlert: false
            }
        );

        this.renderJobList = this.renderJobList.bind(this);
        this.saveJob = this.saveJob.bind(this);
    }

    //======================================================================================

    getAllInternalJobs() {
        internalJobsService.getAllInternalJobs().then(
            res =>
                this.setState({
                    jobList: res
                })
        )
    }

    //-----------------------------------------------------------------------------------------

    getInternalJobs() {
        this.setState({
            LookedForJobs: true
        });

        if (this.state.userId !== null) {
            internalJobsService.getInternalJobsById(this.state.userId).then((jobsArr) => {
                this.setState({savedJobs: jobsArr})
            })
        }
    }

    //-----------------------------------------------------------------------------------------

    getInternalJobsByTag() {
        internalJobsService.getInternalJobsByTag(
            document.getElementById('tagInput').value)
            .then(res => this.setState({jobList: res}))
    }

    //====================================================================================

    saveJob(e) {

        if (this.state.loggedIn) {
            internalJobsService.addUserToInJob(e.target.id, this.state.userId);
            var sj = this.state.savedJobsIds;
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
                triedLoggingIn: true,
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
            this.getAllInternalJobs();
            this.checkIfLoggedIn();
        } else if (this.state.jobList && !this.state.addedJobs) {
            this.setState({
                addedJobs: true
            });
            this.getInternalJobs();
        } else if (this.state.jobList) {
            return this.state.jobList
                .map((item, index) => {
                    let alreadySaved = false;
                    if (this.state.loggedIn) {
                        alreadySaved = this.state.savedJobs.filter((job) => job.id === item.id).length > 0;
                    }
                    if (this.state.savedJobsIds.filter((jobId) => jobId === item.id.toString()).length > 0) {
                        alreadySaved = true;
                    }
                    return <tr className="d-flex" key={index}>
                        <td className="col-5">
                            <Link to={`/details/${item.id}`}
                                  style={{color: 'black'}}>{item.title}</Link></td>
                        <td className="col-5">
                            {item.description}
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
        if (this.state.triedLoggingIn && !this.state.loggedIn) {
            return (
                <h3> Cant access this page unless logged in, please go back to the HomePage or log in/register.</h3>
            )
        }
        return (
            <div className="container-fluid">
                <h3> Search Jobs by Tag:</h3>
                <div className="form">
                    <div className="form-group">
                    <input id="tagInput" className="form-control col-4"/>
                    <button className="btn btn-primary"
                            onClick={() => this.getInternalJobsByTag()}>Search</button>
                    </div>
                </div>

                <h3> Internal Jobs </h3>

                {this.state.MustLoginAlert &&
                <Alert variant='warning' onClose={() => this.handleDismiss()} dismissible>
                    Must be logged in to save a job to your profile </Alert>
                }
                <table>
                    <thead>
                    <tr className="d-flex">
                        <th className="col-6">Title</th>
                        <th className="col-6">Description</th>
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

import React from 'react';
import Alert from 'react-bootstrap/Alert'
import {Link} from "react-router-dom";

import ExternalJobsService from '../../services/ExternalJobsSearchService'
import InternalJobsService from '../../services/InternalJobsService'
import UserService from '../../services/UserService';

const externalJobsService = ExternalJobsService.getInstance();
const internalJobsService = InternalJobsService.getInstance();
const userService = UserService.getInstance();

export default class ProfileViewOnly extends React.Component {


    constructor(props) {
        super(props);
        const pathSplit = window.location.href.split("/");
        const profileId = pathSplit[4];
        this.state = {
            profileId: profileId,
            username: "",
            firstName: "",
            lastName: "",
            id: null,
            LookedForJobs: false,
            internalJobs: [],
            externalJobs: []
        }
    }

    //=============================================================================


    getInternalJobs() {

        this.setState({
            LookedForJobs: true
        });

        if (this.state.id !== null) {
            internalJobsService.getInternalJobsById(this.state.id).then((jobsArr) => {
                this.setState({internalJobs: jobsArr})
            })
        }
    }

    //--------------------------------------------------------------------------------

    getExternalJobs() {

        this.setState({
            LookedForJobs: true
        });

        if (this.state.id !== null) {
            externalJobsService.getJobsForUser(this.state.id).then((jobsArr) => {
                this.setState({externalJobs: jobsArr})
            })
        }
    }

    //-------------------------------------------------------------------------------

    getUser() {
        userService.findOtherProfile(this.state.profileId).then(response => {
                this.setState({
                    username: response.username,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    id: response.id
                });
            }
        )
    }

    //=============================================================================

    renderSavedJobs(job, index, inOrEx) {

        if (inOrEx === "in") {
            return <tr className="d-flex" key={index}>
                <td className="col-6">
                    <Link to={`/details/${job.id}`}
                          style={{color: 'black'}}>{job.title}</Link></td>
                <td className="col-6">
                    {job.description}
                </td>
            </tr>;
        } else {
            return <tr className="d-flex" key={index}>
                <td className="col-6">
                    <Link to={`/details/${job.id}`}
                          style={{color: 'black'}}>{job.title}</Link></td>
                <td className="col-6">
                    {job.company}
                </td>
            </tr>;
        }
    }

    //=============================================================================

    render() {

        if (this.state.username === "") {
            this.getUser();
        } else if (this.state.id !== null && !this.state.LookedForJobs) {
            this.getExternalJobs();
            this.getInternalJobs();
        }

        return (
            <div>
                {(this.state.username !== "") &&
                <div>
                    <legend className="">Welcome to another Bountium User's Profile Page. Only this User's public
                        information is shown.
                    </legend>
                    <div className="container">

                        {this.state.PasswordDifAlert &&
                        <Alert variant='warning' onClose={() => this.handleDismiss("PasswordDifAlert")} dismissible>
                            Password fields are not the same </Alert>}
                        {this.state.PasswordLenAlert &&
                        <Alert variant='warning' onClose={() => this.handleDismiss("PasswordLenAlert")} dismissible>
                            Password needs to be at least 8 characters long </Alert>}

                        {this.state.PasswordSuccessAlert &&
                        <Alert variant='success' onClose={() => this.handleDismiss("PasswordSuccessAlert")} dismissible>
                            Password Successfully Changed </Alert>}
                        {this.state.ChangesSuccessAlert &&
                        <Alert variant='success' onClose={() => this.handleDismiss("ChangesSuccessAlert")} dismissible>
                            User Data Successfully Changed</Alert>}


                        <div className="form">
                            <div className="form-group">
                                <label htmlFor="username"
                                       className="col-form-label">
                                    Username </label>
                                <input className="form-control"
                                       id="username"
                                       placeholder="Dao Manager Username"
                                       value={this.state.username}
                                       readOnly/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="firstName"
                                       className="col-form-label">
                                    First Name </label>
                                <input className="form-control"
                                       id="firstName"
                                       value={this.state.firstName}
                                       readOnly/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName"
                                       className="col-form-label">
                                    Last Name </label>
                                <input className="form-control"
                                       id="lastName"
                                       value={this.state.lastName}
                                       readOnly/>
                            </div>
                        </div>
                    </div>
                    <br>
                    </br>

                    <div className="container-fluid">
                        {this.state.username !== "null" && <div className="row mt-1">
                            {this.state.internalJobs && <div className="col-6">
                                <legend>Saved Internal Jobs</legend>
                                <table>
                                    <tbody>
                                    {this.state.internalJobs.map((job, index) =>
                                        this.renderSavedJobs(job, index, "in"))}
                                    </tbody>
                                </table>
                            </div>}
                            {this.state.externalJobs && <div className="col-6">
                                <legend>Saved External Jobs</legend>
                                <table>
                                    <tbody>
                                    {this.state.externalJobs.map((job, index) =>
                                        this.renderSavedJobs(job, index, "ex"))}
                                    </tbody>
                                </table>
                            </div>}
                        </div>}
                    </div>
                </div>
                }
            </div>
        )
    }
}

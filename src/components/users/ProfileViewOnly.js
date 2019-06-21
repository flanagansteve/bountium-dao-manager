import React from 'react';
import Alert from 'react-bootstrap/Alert'

import UserService from '../../services/UserService';
import UserJobService from '../../services/UserJobsService'
import {Link} from "react-router-dom";

const userService = UserService.getInstance();
const userJobsService = UserJobService.getInstance();

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
            userJobsService.getInternalJobsById(this.state.id).then((jobsArr) => {
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
            userJobsService.getExternalJobsById(this.state.id).then((jobsArr) => {
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

    renderExternalJobList() {
        return this.state.externalJobs
            .map(function (item, index) {
                return <tr className="d-flex"
                           key={index}>
                    <td className="col-6">
                        <Link to={`/details/${item.id}`}
                              style={{color: 'black'}}>{item.title}</Link></td>
                    <td className="col-6">
                        {item.company}
                    </td>
                </tr>;
            });
    }

    //-------------------------------------------------------------------------------

    renderInternalJobList() {
        return this.state.internalJobs
            .map(function (item, index) {
                return <tr className="d-flex"
                           key={index}>
                    <td className="col-6">
                        <Link to={`/details/${item.id}`}
                              style={{color: 'black'}}>{item.title}</Link></td>
                    <td className="col-6">
                        {item.company}
                    </td>
                </tr>;
            });
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
                    <table>
                        <thead>
                        <tr className="d-flex">
                            <th className="col-6">Title</th>
                            <th className="col-6">Company Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.externalJobs && this.renderExternalJobList()}
                        </tbody>
                    </table>

                    <table>
                        <thead>
                        <tr className="d-flex">
                            <th className="col-6">Title Internal</th>
                            <th className="col-6">Company Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.internalJobs && this.renderInternalJobList()}
                        </tbody>
                    </table>
                </div>
                }
            </div>
        )
    }
}

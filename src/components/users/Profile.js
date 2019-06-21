import React from 'react';
import Alert from 'react-bootstrap/Alert'

import UserService from '../../services/UserService';
import UserJobsService from '../../services/UserJobsService'
import {Link} from "react-router-dom";

const userService = UserService.getInstance();
const userJobsService = UserJobsService.getInstance();

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            id: this.props.user.id,
            username: this.props.user.username,
            password: this.props.user.password,
            newPassword: "",
            verifyPassword: "",
            firstName: this.props.user.firstName,
            lastName: this.props.user.lastName,
            externalJobs: [],
            internalJobs: [],
            LookedForJobs: false,
            ViewingPassword: false,
            PasswordDifAlert: false,
            PasswordLenAlert: false,
            PasswordSuccessAlert: false,
            ChangesSuccessAlert: false
        }
    }

    //==========================================================================================

    handleDismiss = (alert) => {
        switch (alert) {
            case "PasswordDifAlert" :
                this.setState({PasswordDifAlert: false});
                break;
            case "PasswordLenAlert" :
                this.setState({PasswordLenAlert: false});
                break;
            case "PasswordSuccessAlert" :
                this.setState({PasswordSuccessAlert: false});
                break;
            case "ChangesSuccessAlert" :
                this.setState({ChangesSuccessAlert: false});
                break;
            default :
                break;
        }
    };

    handleShow = (alert) => {
        switch (alert) {
            case "PasswordDifAlert" :
                this.setState({PasswordDifAlert: true});
                break;
            case "PasswordLenAlert" :
                this.setState({PasswordLenAlert: true});
                break;
            case "PasswordSuccessAlert" :
                this.setState({PasswordSuccessAlert: true});
                break;
            case "ChangesSuccessAlert" :
                this.setState({ChangesSuccessAlert: true});
                break;
            default :
                break;
        }
    };

    //=============================================================================

    firstNameChanged = (event) => {
        this.setState({
            firstName: (event.target.value)
        })
    };

    lastNameChanged = (event) => {
        this.setState({
            lastName: (event.target.value)
        })
    };

    passwordChanged = (event) => {
        this.setState({
            newPassword: (event.target.value)
        })
    };

    verifyChanged = (event) => {
        this.setState({
            verifyPassword: (event.target.value)
        })
    };

    //===============================================================================

    viewPassword = () => {
        this.setState({
            ViewingPassword: true
        })
    };

    hidePassword = () => {

        // Make sure passwords are the same
        if (this.state.newPassword !== this.state.verifyPassword) {
            this.handleShow("PasswordDifAlert")
        } else if (this.state.newPassword.length < 8) {
            this.handleShow("PasswordLenAlert")
        } else {
            let updatedUser = {
                id: this.state.id,
                username: this.state.username,
                password: this.state.newPassword,
                firstName: this.state.firstName,
                lastName: this.state.lastName
            };

            userService.updateUser(updatedUser).then(response => {
                    this.setState({
                        password: response.password,
                        newPassword: "",
                        verifyPassword: "",
                        firstName: response.firstName,
                        lastName: response.lastName
                    })
                }
            );
            this.setState({
                ViewingPassword: false,
                PasswordSuccessAlert: true,
            });
        }


    };

    //=====================================================================

    updateInfo = () => {

        this.setState({
            PasswordDifAlert: false,
            PasswordLenAlert: false,
            PasswordSuccessAlert: false,
            ChangesSuccessAlert: false
        });

        let updatedUser = {
            id: this.state.id,
            username: this.state.username,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        };
        userService.updateUser(updatedUser).then(response => {
                if (response !== null) {
                    this.setState({
                        username: response.username,
                        password: response.password,
                        firstName: response.firstName,
                        lastName: response.lastName,
                        ChangesSuccessAlert: true
                    });
                }
            }
        )
    };

    //-------------------------------------------------------------------------------

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

    // TODO make this render an internal liked jobs and an external liked jobs
    // TODO make those lists pretty
    // TODO duplicate this on the profileViewOnly

    //=============================================================================

    renderSavedJobs(job, index) {
        return <tr className="d-flex" key={index}>
            <td className="col-6">
                <Link to={`/details/${job.id}`}
                      style={{color: 'black'}}>{job.title}</Link></td>
            <td className="col-6">
                {job.company}
            </td>
        </tr>;
    }

//=============================================================================

    render() {

        if (!this.state.LookedForJobs && this.state.username !== "null") {
            this.getExternalJobs();
            this.getInternalJobs();
        }

        return (
            <div>
                {this.state.username === "null" &&
                <legend className="">You are not currently logged in!</legend>}

                {(this.state.username !== "") && (this.state.username !== "null") &&
                <div>
                    <legend className="">Welcome to your Profile page where you can view and edit your public and
                        private information
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
                                       onChange={(event) => this.firstNameChanged(event)}/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName"
                                       className="col-form-label">
                                    Last Name </label>
                                <input className="form-control"
                                       id="lastName"
                                       value={this.state.lastName}
                                       onChange={(event) => this.lastNameChanged(event)}/>
                            </div>

                            <button
                                onClick={() => this.updateInfo()}
                                type="button"
                                className="btn btn-block btn-info">
                                Save Profile Changes
                            </button>

                            {!this.state.ViewingPassword &&
                            <button
                                onClick={() => this.viewPassword()}
                                type="button"
                                className="btn btn-block btn-primary">
                                Change Password
                            </button>
                            }

                            {this.state.ViewingPassword &&
                            <div>
                                <div className="form-group">
                                    <label htmlFor="password"
                                           className="col-form-label">
                                        Old Password </label>
                                    <input className="form-control"
                                           id="password"
                                           value={this.state.password}
                                           readOnly/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="newPassword"
                                           className="col-form-label">
                                        New Password </label>
                                    <input type="password"
                                           className="form-control"
                                           id="newPassword"
                                           placeholder="123qwe#$%"
                                           onChange={(event) => this.passwordChanged(event)}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="verify-password"
                                           className="col-form-label">
                                        Verify Password </label>
                                    <input type="password"
                                           className="form-control"
                                           id="verify-password"
                                           placeholder="123qwe#$%"
                                           onChange={(event) => this.verifyChanged(event)}/>
                                </div>
                                <button
                                    onClick={() => this.hidePassword()}
                                    type="button"
                                    className="btn btn-block btn-primary">
                                    Update Password
                                </button>
                            </div>
                            }
                        </div>
                    </div>

                    <br>
                    </br>

                    <div className="container-fluid">
                        {this.state.user.username !== "null" && <div className="row mt-1">
                            {this.state.internalJobs && <div className="col-6">
                                <legend>Saved Internal Jobs</legend>
                                <table>
                                    <tbody>
                                    {this.state.internalJobs.map(this.renderSavedJobs)}
                                    </tbody>
                                </table>
                            </div>}
                            {this.state.externalJobs && <div className="col-6">
                                <legend>Saved External Jobs</legend>
                                <table>
                                    <tbody>
                                    {this.state.externalJobs.map(this.renderSavedJobs)}
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

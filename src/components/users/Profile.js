import React from 'react';
import Alert from 'react-bootstrap/Alert'

import UserService from '../../services/UserService';
import HTTPService from '../../services/HTTPService'

import Cookies from 'universal-cookie';

const cookies = new Cookies();

const userService = UserService.getInstance();
const httpService = HTTPService.getInstance();

export default class Profile extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            newPassword: "",
            verifyPassword: "",
            firstName: "",
            lastName: "",
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
        } else if (this.state.password.length < 8) {
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

            console.log(response);

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

    //=============================================================================

    render() {

        if (this.state.username === "") {
            httpService.receiveSessionProfile().then(response =>
                this.setState({
                    id: response.id,
                    username: response.username,
                    password: response.password,
                    firstName: response.firstName,
                    lastName: response.lastName
                })
            )
        }

        return (


            <div>
                {(this.state.username !== "") &&
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
                </div>
                }
            </div>
        )
    }
}

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
            verifyPassword: "",
            firstName: "",
            lastName: "",
            PasswordDifAlert: false,
            PasswordLenAlert: false,
        }
    }

    handleDismiss = (alert) => {
        switch (alert) {
            case "PasswordDifAlert" :
                this.setState({PasswordDifAlert: false});
                break;
            case "PasswordLenAlert" :
                this.setState({PasswordLenAlert: false});
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
        }
    };

    //=============================================================================

    passwordChanged = (event) => {
        this.setState({
            password: (event.target.value)
        })
    };

    verifyChanged = (event) => {
        this.setState({
            verifyPassword: (event.target.value)
        })
    };

    //===============================================================================

    signUp = () => {

        this.setState({
            returnedUser: null,
            UsernameTakenAlert: false,
            UsernameSpaceAlert: false,
            PasswordDifAlert: false,
            PasswordLenAlert: false,
            FillOutFieldsAlert: false
        });

        // Make sure all fields are filled out
        if (this.state.username === "" || this.state.password === "" || this.state.verifyPassword === "") {
            this.handleShow("FillOutFieldsAlert")
        }
        // Make sure passwords are the same
        else if (this.state.password !== this.state.verifyPassword) {
            this.handleShow("PasswordDifAlert")
        } else if (this.state.password.length < 8) {
            this.handleShow("PasswordLenAlert")
        }
        // Make sure the Username is has no spaces
        else if (this.state.username.indexOf(' ') > 0) {
            this.handleShow("UsernameSpaceAlert")
        } else {
            let newUser = {
                username: this.state.username,
                password: this.state.password,
                firstName: "",
                lastName: ""
            };
            userService.createUser(newUser).then(response => {
                    if (response.username !== "null") {
                        this.setState({
                            returnedUser: response
                        });

                        httpService.registerUser(response).then( response =>
                            console.log("Registered User" + JSON.stringify(response))
                        );

                    } else {
                        this.handleShow("UsernameTakenAlert")
                    }
                }
            );
        }
        console.log(this.state);
    };

    //=============================================================================

    render() {

        if(this.state.username === ""){
            httpService.receiveSessionProfile().then(response =>
                this.setState({
                    username: response.username,
                    password: response.password,
                    verifyPassword: response.password,
                    firstName: response.firstName,
                    lastName: response.lastName
                })
            )
        }

        return (


            <div>
                {(this.state.username !== "") &&
                <div>
                    <legend className="">Sign up to save marketplaces, enable chat with co-owners, and more</legend>
                    <div className="container">
                        {this.state.PasswordDifAlert &&
                        <Alert variant='warning' onClose={() => this.handleDismiss("PasswordDifAlert")} dismissible>
                            Password fields are not the same </Alert>}
                        {this.state.PasswordLenAlert &&
                        <Alert variant='warning' onClose={() => this.handleDismiss("PasswordLenAlert")} dismissible>
                            Password needs to be at least 8 characters long </Alert>}
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
                                <label htmlFor="password"
                                       className="col-form-label">
                                    Password </label>
                                <input type="password"
                                       className="form-control"
                                       id="password"
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
                                onClick={() => this.signUp()}
                                type="button"
                                className="btn btn-block btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}

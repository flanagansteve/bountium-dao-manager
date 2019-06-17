import React from 'react';
import Alert from 'react-bootstrap/Alert'

import UserService from '../../services/UserService';

const userService = UserService.getInstance();

export default class Register extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            verifyPassword: "",
            UsernameTakenAlert: false,
            UsernameSpaceAlert: false,
            PasswordDifAlert: false,
            PasswordLenAlert: false,
            FillOutFieldsAlert: false,
            returnedUser: null
        }
    }

    /* =======================================================================*/

    handleDismiss = (alert) => {
        switch (alert) {
            case "UsernameTakenAlert" :
                this.setState({UsernameTakenAlert: false});
                break;
            case "UsernameSpaceAlert" :
                this.setState({UsernameSpaceAlert: false});
                break;
            case "PasswordDifAlert" :
                this.setState({PasswordDifAlert: false});
                break;
            case "PasswordLenAlert" :
                this.setState({PasswordLenAlert: false});
                break;
            case "FillOutFieldsAlert" :
                this.setState({FillOutFieldsAlert: false});
                break;
        }
    };

    handleShow = (alert) => {
        switch (alert) {
            case "UsernameTakenAlert" :
                this.setState({UsernameTakenAlert: true});
                break;
            case "UsernameSpaceAlert" :
                this.setState({UsernameSpaceAlert: true});
                break;
            case "PasswordDifAlert" :
                this.setState({PasswordDifAlert: true});
                break;
            case "PasswordLenAlert" :
                this.setState({PasswordLenAlert: true});
                break;
            case "FillOutFieldsAlert" :
                this.setState({FillOutFieldsAlert: true});
                break;
        }
    };

    /* ======================================================================= */

    usernameChanged = (event) => {
        this.setState({
            username: (event.target.value)
        })
    };

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

    /* ======================================================================= */

    signUp = () => {

        this.setState({
            returnedUser: null,
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
                        })
                    } else {
                        this.handleShow("UsernameTakenAlert")
                    }
                }
            );
        }
        console.log(this.state);
    };

    /* ========================================================================= */


    render() {
        return (


            <div>
                <div className="bg-primary bountium-user-header container">
                    <header className="container-fluid">Sign Up</header>
                </div>

                <div className="container">

                    <p>
                        <br>
                        </br>
                    </p>

                    {this.state.UsernameTakenAlert &&
                    <Alert variant='danger' onClose={() => this.handleDismiss("UsernameTakenAlert")} dismissible>
                        Username is already taken </Alert>}

                    {this.state.UsernameSpaceAlert &&
                    <Alert variant='danger' onClose={() => this.handleDismiss("UsernameSpaceAlert")} dismissible>
                        Username cannot have any spaces </Alert>}

                    {this.state.PasswordDifAlert &&
                    <Alert variant='warning' onClose={() => this.handleDismiss("PasswordDifAlert")} dismissible>
                        Password fields are not the same </Alert>}

                    {this.state.PasswordLenAlert &&
                    <Alert variant='warning' onClose={() => this.handleDismiss("PasswordLenAlert")} dismissible>
                        Password needs to be at least 8 characters long </Alert>}

                    {this.state.FillOutFieldsAlert &&
                    <Alert variant='warning' onClose={() => this.handleDismiss("FillOutFieldsAlert")} dismissible>
                        Fill out all of the fields before pressing the sign up button </Alert>}

                    {(this.state.PasswordDifAlert || this.state.UsernameTakenAlert || this.state.FillOutFieldsAlert)
                    || this.state.UsernameSpaceAlert || this.state.PasswordLenAlert &&
                    <p>
                        <br>
                        </br>
                    </p>}


                    <form>
                        <div className="form-group row container-fluid">
                            <label htmlFor="username"
                                   className="col-sm-2 col-lg-1 col-form-label">
                                Username </label>
                            <div className="col-sm-10">
                                <input className="form-control"
                                       id="username"
                                       placeholder="Dao Manager Username"
                                       onChange={(event) => this.usernameChanged(event)}/>
                            </div>
                        </div>

                        <div className="form-group row container-fluid">
                            <label htmlFor="password"
                                   className="col-sm-2 col-lg-1 col-form-label">
                                Password </label>
                            <div className="col-sm-10">
                                <input type="password"
                                       className="form-control"
                                       id="password"
                                       placeholder="123qwe#$%"
                                       onChange={(event) => this.passwordChanged(event)}/>
                            </div>
                        </div>

                        <div className="form-group row container-fluid">
                            <label htmlFor="verify-password"
                                   className="col-sm-2  col-lg-1 col-form-label">
                                Verify Password </label>
                            <div className="col-sm-10">
                                <input type="password"
                                       className="form-control"
                                       id="verify-password"
                                       placeholder="123qwe#$%"
                                       onChange={(event) => this.verifyChanged(event)}/>
                            </div>
                        </div>


                        <div className="form-group row container-fluid">
                            <label className="col-sm-2 col-lg-1 col-form-label"/>
                            <div className="col-sm-10">
                                <button
                                    onClick={() => this.signUp()}
                                    type="button"
                                    className="btn btn-block btn-primary">
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    </form>

                    <p>
                        <br>
                        </br>
                    </p>

                </div>

            </div>
        )
    }
}
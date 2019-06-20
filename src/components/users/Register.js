import React from 'react';
import Alert from 'react-bootstrap/Alert'

import HTTPService from '../../services/HTTPService'
const httpService = HTTPService.getInstance();

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
        }
    }

    //=======================================================================

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
            default:
                break;
        }
    };

    //-----------------------------------------------------------------------

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
            default :
                break;
        }
    };

    //=======================================================================

    usernameChanged = (event) => {
        this.setState({
            username: (event.target.value)
        })
    };

    //-----------------------------------------------------------------------

    passwordChanged = (event) => {
        this.setState({
            password: (event.target.value)
        })
    };

    //-----------------------------------------------------------------------

    verifyChanged = (event) => {
        this.setState({
            verifyPassword: (event.target.value)
        })
    };

    //=======================================================================

    signUp = () => {

        this.setState({
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
            httpService.registerUser(newUser).then(response => {

                    if (response.username === "null") {
                        this.setState({
                            UsernameTakenAlert: true
                        });
                    } else {
                        window.location.href = ("/profile");
                    }
                }
            )
        }
    };

    //==============================================================================

    render() {

        return (
            <div>
                <legend className="">Sign up to save marketplaces, enable chat with co-owners, and more</legend>
                <div className="container">
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
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username"
                                   className="col-form-label">
                                Username </label>
                            <input className="form-control"
                                   id="username"
                                   placeholder="Dao Manager Username"
                                   onChange={(event) => this.usernameChanged(event)}/>
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
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

import React from 'react';
import Alert from "react-bootstrap/Alert";

import HTTPService from '../../services/HTTPService'

const httpService = HTTPService.getInstance();

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            IncorrectLogin: false,
        }
    }

    //=================================================================

    handleDismiss = () => {
        this.setState({
            IncorrectLogin: false
        })
    };

    handleShow = () => {
        this.setState({
            IncorrectLogin: true
        })
    };

    //===================================================================

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

    //===================================================================

    signIn = () => {

        this.setState({
            IncorrectLogin: null
        });

        let loginUser = {
            username: this.state.username,
            password: this.state.password,
            firstName: "",
            lastName: ""
        };

        httpService.loginUser(loginUser).then(response => {
                if (response.username === "null") {
                    this.setState({
                        IncorrectLogin: true
                    });
                } else {
                    window.location.href = ("/profile");
                }
            }
        )
    };

//====================================================================

    render() {
        return (
            <div>
                <legend>Welcome back - sign in to continue</legend>
                <div className="container-fluid">

                    {this.state.IncorrectLogin &&
                    <Alert variant='danger' onClose={() => this.handleDismiss()} dismissible>
                        Incorrect Username of Password </Alert>}

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
                                   className="form-control font-normal"
                                   id="password"
                                   placeholder="Password"
                                   onChange={(event) => this.passwordChanged(event)}/>
                        </div>
                        <button
                            onClick={() => this.signIn()}
                            type="button"
                            className="btn btn-block btn-primary">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

import React from 'react'
import {Link} from "react-router-dom";
import HTTPService from '../services/HTTPService'

const httpService = HTTPService.getInstance();

export default class Navbar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: null
        }
    }

    checkIfLoggedIn() {
        httpService.receiveSessionProfile().then((profile) => {
            this.setState({
                loggedIn: (profile.username !== "null")
            });
        });
    }

    logOut() {
        httpService.logOutUser();
        this.setState({
            loggedIn: false
        })
    }


    render() {

        if (this.state.loggedIn === null) {
            this.checkIfLoggedIn();
        }

        return (
            <div className="col-12">
                {(this.state.loggedIn !== null) &&
                <div>
                    <ul className="nav navbar-collapse md-auto">
                        <li className="nav-item">
                            <Link className="navbar-brand"
                                  to="/">Bountium Business Manager</Link>
                        </li>
                        {!this.state.loggedIn && <li className="nav-item ml-auto mt-3">
                            <p className="nav-link">
                                <Link className=""
                                      to="/login/">Login </Link>
                                or
                                <Link className=""
                                      to="/register/"> sign up </Link>
                                to get even more features
                            </p>
                        </li>}
                        {this.state.loggedIn &&
                        <li className="nav-item ml-auto mt-3">
                            <p className="nav-link">
                                <Link className=""
                                      to="/profile/">Profile</Link>
                            </p>
                        </li>}
                        {this.state.loggedIn &&
                        <li className="nav-item mt-3">
                            <p className="nav-link">
                                <Link className=""
                                      onClick={() => this.logOut()}
                                      to="/logout/">Logout</Link>
                            </p>
                        </li>
                        }
                    </ul>
                </div>
                }
            </div>
        );
    }
}

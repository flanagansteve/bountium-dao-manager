import React from 'react';

//import UserService from '../../services/UserService'

//const userService = UserService.getInstance();

export default class Login extends React.Component {


    render() {
        return (
            <div>
                <div className="container bg-primary">
                    <header className="container-fluid">Sign In</header>
                </div>

                <div className="container">
                    <form>
                        <p>
                            <br>
                            </br>
                        </p>

                        <div className="form-group row container-fluid">
                            <label for="username"
                                   className="col-sm-2  col-lg-1 col-form-label">
                                Username </label>
                            <div className="col-sm-10">
                                <input className="form-control"
                                       id="username"
                                       placeholder="Alice"/>
                            </div>
                        </div>


                        <div className="form-group row container-fluid">
                            <label htmlFor="password"
                                   className="col-sm-2 col-lg-1 col-form-label">
                                Password </label>
                            <div className="col-sm-10">
                                <input type="password"
                                       className="form-control font-normal"
                                       id="password"
                                       placeholder="123qwe#$%"/>
                            </div>
                        </div>


                        <div className="form-group row container-fluid">
                            <label className="col-sm-2 col-lg-1 col-form-label"/>
                            <div className="col-sm-10">
                                <button
                                    onClick="location.href='/profile/profile.template.client.html#anchor'"
                                    type="button"
                                    className="btn btn-block btn-primary">
                                    Sign In
                                </button>
                                <div className="row">
                                    <div className="col-6">
                                        <a href="#">
                                        </a>
                                    </div>
                                    <div className="col-6">
                                        <a href="/register/register.template.client.html"
                                           className="float-right">
                                            </a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6"/>
                                    <div className="col-6">
                                        <a href="/"
                                           className="float-right">
                                           </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
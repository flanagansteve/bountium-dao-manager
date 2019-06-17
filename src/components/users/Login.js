import React from 'react';

export default class Login extends React.Component {


    render() {
        return (
            <div>
                <h5>Welcome back - sign in to continue</h5>
                <div className="container-fluid">
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username"
                                   className="col-form-label">
                                Username </label>
                            <input className="form-control"
                                   id="username"
                                   placeholder="Alice"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password"
                                   className="col-form-label">
                                Password </label>
                            <input type="password"
                                   className="form-control font-normal"
                                   id="password"
                                   placeholder="123qwe#$%"/>
                        </div>
                        <button
                            onClick="location.href='/profile/profile.template.client.html#anchor'"
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

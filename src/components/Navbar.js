import React from 'react'
import {Link} from "react-router-dom";
import HTTPService from '../services/HTTPService'
const httpService = HTTPService.getInstance();

export default class Navbar extends React.Component {

  render() {
    var loggedIn = false;
    httpService.receiveSessionProfile().then( (profile) => loggedIn = (profile.username != null));
    return (
      <div className="col-12">
        <ul className="nav navbar-collapse md-auto">
          <li className = "nav-item">
            <Link className="navbar-brand" to="/">Bountium Business Manager</Link>
          </li>
          {loggedIn && <li className="nav-item ml-auto mt-3">
            <p className="nav-link">
              <Link className="" to="/login/">Login </Link>
              or
              <Link className="" to="/register/"> sign up </Link>
              to get even more features
            </p>
          </li>}
          {!loggedIn &&
            <li className="nav-item ml-auto mt-3">
              <p className="nav-link">
                <Link className="" to="/profile/">Profile</Link>
              </p>
            </li>}
          {!loggedIn &&
            <li className="nav-item mt-3">
              <p className="nav-link">
                <Link className="" to="/logout/">Logout</Link>
              </p>
            </li>
          }
        </ul>
      </div>
    );
  }

}

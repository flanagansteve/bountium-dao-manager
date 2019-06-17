import React from 'react'
import {Link} from "react-router-dom";

export default class Navbar extends React.Component {

  render() {
    return <header className="navbar navbar-expand">
          <Link className="navbar-brand mr-0 mr-md-2" to="/">Bountium Business Manager</Link>
          <div className="col-8 d-none d-md-inline my-navbar">
            <ul className="nav navbar-collapse">
              <li className="nav-item mt-2 ml-auto">
                <p>
                  <Link className="" to="/login/">Login </Link>
                  or
                  <Link className="" to="/register/"> sign up </Link>
                  to get even more features
                </p>
              </li>
              {/* We don't need these yet but they're here if we want them:
              <li className="nav-item">
                <Link className="nav-link" to="/course/grid">Grid</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/widgets">Widgets</Link>
              </li>*/}
            </ul>
          </div>
      </header>
  }

}

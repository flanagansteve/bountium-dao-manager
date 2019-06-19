import React from 'react'
import {Link} from "react-router-dom";

export default class Navbar extends React.Component {

  constructor(props){
    super(props);


  }

  render() {
    return (
      <div className="col-12">
        <ul className="nav navbar-collapse md-auto">
          <li className = "nav-item">
            <Link className="navbar-brand" to="/">Bountium Business Manager</Link>
          </li>
          <li className="nav-item ml-auto mt-3">
            <p className="nav-link">
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
    );
  }

}

import React from 'react'
import {Link} from "react-router-dom";

export default class Navbar extends React.Component {

  render() {
    return <header className="navbar navbar-expand">
          <a className = "navbar-brand mr-0 mr-md-2" href="/">
            Bountium Business Manager
          </a>
          {/* We don't need these yet but they're here if we want them:
          <div className="col-8 d-none d-md-inline my-navbar">
            <ul className="nav navbar-collapse">
              <li className="nav-item ml-auto">
                <Link className="nav-link" to="/course/table">Table</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/course/grid">Grid</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/widgets">Widgets</Link>
              </li>
            </ul>
          </div>*/}
      </header>
  }

}

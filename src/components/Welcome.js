import React from 'react'
import PostingPage from './PostingPage'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import JobSearchList from './JobSearchList'
import Navbar from './Navbar'
import NewBusinessWorkflow from './NewBusinessWorkflow'
import MigratingBusinessWorkflow from './MigratingBusinessWorkflow'
import ReturningBusinessWorkflow from './ReturningBusinessWorkflow'
import Login from './users/Login'
import Register from './users/Register'
import BizMgr from './BizMgr'

export default class Welcome extends React.Component {

  render() {
    return <div className="container-fluid">
        <Router>
          <Navbar/>
          <Switch>
            <Route path="/post/" render={() => <PostingPage/>}/>
            <Route path="/job-search-list/:jobWord" render={() => <JobSearchList/>}/>
            <Route path="/new" render={() => <NewBusinessWorkflow/>}/>
            <Route path="/migrating" render={() => <MigratingBusinessWorkflow/>}/>
            <Route path="/returning" render={() => <ReturningBusinessWorkflow/>}/>
            <Route path="/login" render={() => <Login/>}/>
            <Route path="/register" render={() => <Register/>}/>
            <Route path="/mgr/:bizAddr" component={BizMgr}/>
            <Route path="/"
                   render={() => <div>
                     <h3>Welcome - lets work on your business!</h3>
                     {/* new business starter button */}
                     <div className="container-fluid mt-1">
                       <Link to={`/new/`} className="btn btn-primary">
                         Start a new business
                       </Link>
                     </div>
                     {/* existing business migrater button */}
                     <div className="container-fluid mt-1">
                       <Link to={`/migrating/`} className="btn btn-info">
                         Convert your existing business to Bountium
                       </Link>
                     </div>
                     {/* returning user login */}
                     <div className="container-fluid mt-1">
                       <Link to={`/returning/`} className="btn btn-success">
                         Log in and manage your Bountium business
                       </Link>
                     </div>
                     </div>
                   }/>
          </Switch>
        </Router>
      </div>
  }

}

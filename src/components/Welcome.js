import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import JobSearchList from './JobSearchList'
import Navbar from './Navbar'
import NewBusinessWorkflow from './NewBusinessWorkflow'
import MigratingBusinessWorkflow from './MigratingBusinessWorkflow'
import Login from './users/Login'
import Register from './users/Register'
import Profile from './users/Profile'
import BizMgr from './BizMgr'
import ProfileViewOnly from "./users/ProfileViewOnly";
import JobDetails from "./JobDetails";
import BountyMgr from './BountyMgr'
import JobEmptySearch from "./JobEmptySearch";
import BusinessService from '../services/BusinessService';
import HTTPService from '../services/HTTPService';
const bizService = BusinessService.getInstance();
const httpService = HTTPService.getInstance();


export default class Welcome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user : null,
      biz : null
    }
  }

  renderSavedJobs(job, index) {
    return <tr className="d-flex" key={index}>
        <td className="col-6">
            <Link to={`/details/${job.id}`}
                  style={{color: 'black'}}>{job.title}</Link></td>
        <td className="col-6">
            {job.company}
        </td>
    </tr>;
  }

  renderBusiness(bizId, key) {
    return <tr key={key}>
      <td><a href={"/mgr/" + bizId}>Business at {bizId}</a></td>
    </tr>
  }

  getUser() {
    httpService.receiveSessionProfile().then((user) => {
      this.setState({user : user})
    });
  }

  getBiz(bizId) {
    bizService.getBiz(Number(bizId)).then((biz) => {
      this.setState({biz : biz})
    })
  }

  render() {
    if (!this.state.user)
      this.getUser();
    return <div className="container-fluid">
        {this.state.user && <Router>
          <Navbar/>
          <Switch>
            <Route path="/search/:jobWord" render={() => <JobSearchList/>}/>
            <Route path="/search" render={() => <JobEmptySearch/>}/>
            <Route path="/details/:jobId" render={() => <JobDetails/>}/>
            <Route path="/post/" render={() => <div><h1>Welcome to Bountium</h1><BountyMgr/></div>}/>
            <Route path="/new" render={() => <NewBusinessWorkflow user={this.state.user}/>}/>
            <Route path="/migrating" render={() => <MigratingBusinessWorkflow/>}/>
            <Route path="/returning" render={() => <Login/>}/>
            <Route path="/login" render={() => <Login/>}/>
            <Route path="/register" render={() => <Register/>}/>
            <Route path="/profile/:profileId" render={() => <ProfileViewOnly/>}/>
            <Route path="/profile" render={() => <Profile/>}/>
            <Route path="/mgr/:bizAddr" render={() => {
              if (!this.state.biz)
                this.getBiz(window.location.href.split("/")[4])
              /* TODO use bizService.getBiz to get a biz object*/
              return <div>{this.state.biz && <BizMgr user={this.state.user} biz={this.state.biz}/>}</div>
            }}/>
            <Route path="/" render={() => {
              return <div>
                <h3>Welcome - lets work on your business!</h3>
                <div className="row">
                  <div className="col-6">
                    <div className="container-fluid mt-1">
                      <Link to={`/new/`} className="btn btn-primary">
                        Start a new business
                      </Link>
                    </div>
                    <div className="container-fluid mt-1">
                      <Link to={`/migrating/`} className="btn btn-info">
                        Convert your existing business to Bountium
                      </Link>
                    </div>
                    <div className="container-fluid mt-1">
                      <Link to={`/returning/`} className="btn btn-success">
                        Log in and manage your Bountium business
                      </Link>
                    </div>
                  </div>
                  <div className="col-6 float-right">
                    <h4>Browse businesses</h4>
                    {/*TODO pulled liked businesses from profile*/}
                    <table>
                      <tbody>
                        {['2', '12', '22'].map(this.renderBusiness)}
                      </tbody>
                    </table>
                    {this.state.user.username !== null && <div>
                      <legend>Saved Jobs</legend>
                      <table>
                        <tbody>
                          this.state.user.savedJobs.map(this.renderSavedJobs)
                        </tbody>
                      </table>
                    </div>}
                  </div>
                </div>
              </div>}}/>
          </Switch>
        </Router>}
      </div>
  }

}

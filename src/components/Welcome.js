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
import BusinessService from '../services/BusinessService';
const bizService = BusinessService.getInstance();


export default class Welcome extends React.Component {

  constructor(props) {
    super(props)
    this.renderBusinessToLogged = this.renderBusinessToLogged.bind(this);
  }

  addToLiked() {
    // TODO somehow use httpService to add the e.target.id business to a user's
    // liked businesses
  }

  renderBusinessToLogged(bizId, key) {
    return <tr key={key}>
      <td><a href={"/mgr/" + bizId}>Business at {bizId}</a></td>
      <td><button id={bizId} className="btn btn-primary" onClick={this.addToLiked}>Like</button></td>
    </tr>
  }

  renderBusinessToAnon(bizId, key) {
    return <tr key={key}>
      <td><a href={"/mgr/" + bizId}>Business at {bizId}</a></td>
    </tr>
  }

  render() {
    // TODO how do we use the HTTPService to actually figure this out?
    var loggedIn = true;
    return <div className="container-fluid">
        <Router>
          <Navbar/>
          <Switch>
            <Route path="/search/:jobWord" render={() => <JobSearchList/>}/>
            <Route path="/details/:jobId" render={() => <JobDetails/>}/>
            <Route path="/post/" render={() => <div><h1>Welcome to Bountium</h1><BountyMgr/></div>}/>
            <Route path="/new" render={() => <NewBusinessWorkflow/>}/>
            <Route path="/migrating" render={() => <MigratingBusinessWorkflow/>}/>
            <Route path="/returning" render={() => <Login/>}/>
            <Route path="/login" render={() => <Login/>}/>
            <Route path="/register" render={() => <Register/>}/>
            <Route path="/profile/:profileId" render={() => <ProfileViewOnly/>}/>
            <Route path="/profile" render={() => <Profile/>}/>
            <Route path="/mgr/:bizAddr" render={() => {
              /* TODO use bizService.getBiz to get a biz object*/
              return <BizMgr biz={
                {
                  name : "Steve's Salacious Spaghetti Store",
                  description : "We sell the finest spaghetti in Essex county. From stringy, to not stringy, spaghetti, and including all varieties known to man. We grow our spaghetti free-range and cruelty free, and let it roam wild in its youth.",
                  totalShares : 2,
                  orgFunds : 4567,
                  owners : [
                    {
                     username:'Steve', address:'0x3bB1B904FC9f15Ec050108C0FfB3FB5Ba48c5510', shares:1,
                     dividend : true, dilute : true, bestow : true, modifyCatalogue : true, board : true
                    },
                    {
                      username:'John', address:'0x4cA1B904FC9f15Ec050108C0FfB3FB5Ba48c5510', shares:1,
                      dividend : false, dilute : false, bestow : true, modifyCatalogue : true, board : false
                    }
                  ],
                  products : [{name:'weenie', price:1}, {name:'hot dog', price:2}],
                  id : window.location.href.split('/')[4],
                  msgs : [
                    {sender:'steveF', content:'message 1', timestamp:156787654},
                    {sender:'steveA', content:'message 2', timestamp:156787655},
                    {sender:'steveB', content:'why are we all named steve', timestamp:156787656},
                    {sender:'steveC', content:'steve master race', timestamp:156787657},
                    {sender:'steveF', content:'lol i am sending a second msg', timestamp:156787658},
                    {sender:'steveM', content:'message 6', timestamp:156787659},
                    {sender:'steveN', content:'message 7', timestamp:156787660},
                    {sender:'steveK', content:'message 8', timestamp:156787661},
                    {sender:'steveL', content:'message 9', timestamp:156787662},
                    {sender:'steve', content:'i am the one true steve', timestamp:156787663}
                  ]
                }
              }/>
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
                    {loggedIn && <table><tbody>
                        {['1234', '5678'].map(this.renderBusinessToLogged)}
                      </tbody></table>}
                    {!loggedIn && <table><tbody>
                      {['1234', '5678'].map(this.renderBusinessToAnon)}
                    </tbody></table>}
                  </div>
                </div>
              </div>}}/>
          </Switch>
        </Router>
      </div>
  }

}

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
import BusinessService from '../services/BusinessService';
const bizService = BusinessService.getInstance();

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
            <Route path="/returning" render={() => <Login/>}/>
            <Route path="/login" render={() => <Login/>}/>
            <Route path="/register" render={() => <Register/>}/>
            <Route path="/mgr/:bizAddr" render={() => {
              {/* TODO use bizService.getBiz to get a biz object*/}
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

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
            <Route path="/mgr/:bizAddr" render={() => {
              {
                /* TODO give it a business object, either from the contract or backend,
                   with all the fields in the below object
                  // TODO this breaks - 'abi.forEach is not a function'
                  bizContract : new web3.eth.Contract(autobizABI, window.location.href.split('/')[4])
                */
              }
              return <BizMgr biz={
                {
                  name : "Steve's Salacious Spaghetti Store",
                  description : "We sell the finest spaghetti in Essex county. From stringy, to not stringy, spaghetti, and including all varieties known to man. We grow our spaghetti free-range and cruelty free, and let it roam wild in its youth.",
                  tags : ['Food', 'Italian', 'Small Business'],
                  shares : 1,
                  totalShares : 2,
                  dividend : true,
                  dilute : true,
                  bestow : true,
                  modifyCatalogue : true,
                  board : true,
                  orgFunds : 'hella',
                  owners : [{name:'you', address:'0x3bB1B904FC9f15Ec050108C0FfB3FB5Ba48c5510', shares:1}, {name:'john', address:'0x4cA1B904FC9f15Ec050108C0FfB3FB5Ba48c5510', shares:1}],
                  products : [{name:'weenie', price:1}, {name:'hot dog', price:2}],
                  id : window.location.href.split('/')[4]
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

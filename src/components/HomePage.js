import React from 'react'
import JobSearchList from './JobSearchList'
import {BrowserRouter as Router, Link, Route, Switch}
    from "react-router-dom";

export default class HomePage extends React.Component {



    render() {
        return (
            <Router>
                <div className="container text-center">
                    <h1>Welcome to Bountium </h1>
                    <div className="row">
                        <div className="col-6">
                            <Link to="/job-search-list"> JobSearch</Link>
                        </div>
                    </div>

                </div>
                <Switch>
                    <Route path="/job-search-list"
                           render={() =>
                               <JobSearchList keywords="python"/>
                               }/>
                </Switch>
            </Router>
        )
    }

}
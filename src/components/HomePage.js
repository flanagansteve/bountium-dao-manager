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
                        <div className="col-12 text-left">
                            <br/>
                            <h1>Post Job</h1>
                            <div className="card">
                                <h2>Category</h2>
                                <select id="jobCategory">
                                    <option value="PYTHON">Python</option>
                                    <option value="JAVA">Java</option>
                                    <option value="HTMLCSS">Html/CSS</option>
                                </select>
                                <br/>
                                <Link to="/job-search-list">See jobs in this category</Link>
                                <br/>
                                <h2>Job Title</h2>
                                <input className="form-control" placeholder="Full Stack Developer">
                                </input>
                                <br/>
                                <h2>Job Description</h2>
                                <textarea className="form-control">
                                </textarea>
                                <br/>
                                <button className="btn btn-primary">Post</button>
                            </div>
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

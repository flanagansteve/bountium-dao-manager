import React from 'react'
import JobSearchList from './JobSearchList'
import {BrowserRouter as Router, Link, Route, Switch}
    from "react-router-dom";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: "PYTHON"}
    }

    updateCategory(value) {
        this.state = {value: value};
    }

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
                                <select id="jobCategory"
                                        onChange={() => this.updateCategory(document.getElementById("jobCategory").value)}>
                                    <option value="PYTHON">Python</option>
                                    <option value="JAVA">Java</option>
                                    <option value="HTML">Html/CSS</option>
                                    <option value="SQL">SQL</option>
                                </select>
                                <br/>
                                <Link to="/job-search-list">See jobs in this category</Link>
                                <br/>
                                <h2>Job Title</h2>
                                <input className="form-control" placeholder="Junior Python Developer Intern">
                                </input>
                                <br/>
                                <h2>Job Description</h2>
                                <textarea className="form-control"
                                          placeholder="Coffee intern needed to ensure execs remain thoroughly caffeinated.">
                                </textarea>
                                <br/>
                                <button className="btn btn-primary"
                                        onClick={() => console.log(this.state.value)}
                                        >Post</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route path="/job-search-list"
                           render={() =>
                               <JobSearchList keywords={this.state.value}/>}/>
                </Switch>
            </Router>
        )
    }

}

import React from 'react';
import JobDetails from './JobDetails'
import {BrowserRouter as Router, Link, Route}
    from "react-router-dom";


export default class JobSearchList extends React.Component {

    constructor(props) {
        super(props);
        const pathSplit = window.location.href.split("/");
        const jobKeyword = pathSplit[4];

        this.state = (
            {
                keywords: jobKeyword,
                jobList: null
            }
        )

        this.renderJobList = this.renderJobList.bind(this);
    }


    getJobs() {
        let url = "https://cors-anywhere.herokuapp.com/http://jobs.github.com/positions.json?description=";

        let wordSplit = this.state.keywords.split(" ");
        for (let i = 0; i < wordSplit.length; i++) {
            if (i === 0) {
                url = url + wordSplit[i];
            } else {
                url = url + "+" + wordSplit[i];
            }
        }

        fetch(url)
            .then(res => res.json())
            .then(json => this.setState({
                jobList: json
            }))
    }

    saveJob(e) {
      // Send to server:
      // thisUser.savedJobs.push(this.state.jobList[e.target.id])
    }

    renderJobList() {
        if (!this.state.jobList) {
            this.getJobs()
        } else if (this.state.jobList.length === 0){
            window.location.href = "/search";
        } else {
            return this.state.jobList
                .map((item, index) => {
                    return <tr className="d-flex" key={index}>
                        <td className="col-5">
                            <Link to={`/details/${item.id}`}
                                  style={{color: 'black'}}>{item.title}</Link></td>
                        <td className="col-5">
                            {item.company}
                        </td>
                        <td className="col-2">
                            <button id={index} className="btn btn-primary" onClick={this.saveJob}>Save</button>
                        </td>
                    </tr>;
                });
        }
    }


    render() {

        return (
            <div className="container-fluid">
                <h1> Job Search List for {this.state.keywords}
                    <span className="float-right">
                            <Link to="/home-page"> Back to Homepage </Link>
                    </span>
                </h1>
                <table>
                    <thead>
                    <tr className="d-flex">
                        <th className="col-6">Title</th>
                        <th className="col-6">Company Name</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.renderJobList()}
                    </tbody>
                </table>
            </div>
        )
    }

}

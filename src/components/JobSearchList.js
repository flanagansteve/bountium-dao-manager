import React from 'react';
import JobDetails from './JobDetails'
import {BrowserRouter as Router, Link, Route}
    from "react-router-dom";

import ExternalJobSearchService from '../services/ExternalJobSearchService'
const jobService = ExternalJobSearchService.getInstance();

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
    }

    //======================================================================================

    addJobsToDatabase() {
        for(let i = 0; i < this.state.jobList.length; i++){
            jobService.addJobToDatabase(this.state.jobList[i])
        }
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
            .then(json => {
                this.setState({
                    jobList: json
                })
            })
    }

    renderJobList() {
        if (!this.state.jobList) {
            this.getJobs()
        } else if (this.state.jobList.length === 0){
            window.location.href = "/search";
        } else {

            this.addJobsToDatabase();

            return this.state.jobList
                .map(function (item, index) {
                    return <tr className="d-flex" >
                        <td className="col-6">
                            <Link to={`/details/${item.id}`}
                                  style={{color: 'black'}}>{item.title}</Link></td>
                        <td className="col-6">
                            {item.company}
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

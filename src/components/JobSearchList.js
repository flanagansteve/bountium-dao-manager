import React from 'react';
import JobSearchService from '../services/JobSearchService'
import {BrowserRouter as Router, Link, Route, Switch}
    from "react-router-dom";

let jobService = JobSearchService.getInstance();

export default class JobSearchList extends React.Component {

    constructor(props) {
        super(props);
        this.state = (
            {
                keywords: props.keywords,
                jobList: null
            }
        )
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

    renderJobList() {
        // var items;
        console.log(this.state.jobList);
        //{this.getJobs()}
        if (!this.state.jobList) {
            this.getJobs()
        } else {

            let items = this.state.jobList
                .map(function (item, index) {


                    return <tr className="d-flex">
                        <td className="col-2"/>
                        <td className="col-6">
                            <Link to={`/course-editor/${item.id}`}
                                  style={{color: 'black'}}>{item.title}</Link></td>
                        <td className="col-4">
                            {item.company}
                        </td>
                    </tr>;
                });
            return (
                <ul className="list-group">
                    {items}</ul>
            )
        }
    }


    render() {
        return (
            <div className="container-fluid">
                <table>
                    <tbody>
                        {this.renderJobList()}
                    </tbody>
                </table>
            </div>
        )
    }

}

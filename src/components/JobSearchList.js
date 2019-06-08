import React from 'react';
import JobSearchService from '../services/JobSearchService'

let jobService = JobSearchService.getInstance();

export default class JobSearchList extends React.Component {

    constructor(props) {
        super(props);
        this.state = (
            {
                apiUrl: "https://jobs.github.com/positions.json?description=",
                keywords: props.keywords,
                jobList: jobService.searchJobApi(props.keywords)
            }
        )
    }


    renderJobList() {
        // var items;
        if (this.state.jobList) {
            console.log(this.state.jobList);
            /*
            items = this.state.
                .map(function(item, index) {
                    return <li className="list-group-item"
                               key={index}>{item.Title}</li>;
                });}
        return (
            <ul className="list-group">
                {items}</ul>
        )}

             */

        }
    }



    render() {
        return (
            <div>
                {this.renderJobList()}
            </div>
        )
    }

}

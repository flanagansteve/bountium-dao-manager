import React from 'react';
import JobSearchService from '../services/JobSearchService'

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
                    return <li className="list-group-item"
                               key={index}>
                        {item.title}: {item.company}</li>;
                });
            return (
                <ul className="list-group">
                    {items}</ul>
            )
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

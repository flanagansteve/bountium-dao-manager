import React from 'react';

export default class JobSearchList extends React.Component {

    constructor(props) {
        super(props);
        this.setState(
            {
                apiUrl: "https://jobs.github.com/positions.json?description="
            }
        )
    }


    renderJobList() {
        var items;
        if(this.state.jobs) {
            items = this.state.movies
                .map(function(item, index) {
                    return <li className="list-group-item"
                               key={index}>{item.Title}</li>;
                });}
        return (
            <ul className="list-group">
                {items}</ul>
        )}



    render() {
        return (
            <div>

            </div>
        )
    }

}

import React from 'react';
import {BrowserRouter as Router, Route, Switch}
    from "react-router-dom";

import HomePage from './components/HomePage'
import JobSearchList from "./components/JobSearchList";


export default class App extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/home-page"
                           render={() =>
                               <HomePage/>}/>
                    <Route path="/job-search-list/:jobWord"
                           render={() =>
                               <JobSearchList/>
                           }/>
                    <Route path="/"
                           render={() =>
                               <HomePage/>}/>
                </Switch>
            </Router>
        )
    }
}
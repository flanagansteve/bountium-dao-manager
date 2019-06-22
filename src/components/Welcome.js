import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import BizMgr from './businesses/BizMgr'
import BountyMgr from './businesses/BountyMgr';
import InternalJobList from "./jobs/InternalJobList";
import JobDetails from "./jobs/JobDetails";
import JobSearchList from './jobs/JobSearchList';
import Login from './users/Login';
import MigratingBusinessWorkflow from './businesses/MigratingBusinessWorkflow';
import Navbar from './Navbar';
import NewBusinessWorkflow from './businesses/NewBusinessWorkflow';
import Profile from './users/Profile';
import ProfileViewOnly from "./users/ProfileViewOnly";
import Register from './users/Register';

import BusinessService from '../services/BusinessService';
import HTTPService from '../services/HTTPService';
import InternalJobsService from '../services/InternalJobsService';
import ExternalJobSearchService from '../services/ExternalJobsSearchService';

const bizService = BusinessService.getInstance();
const httpService = HTTPService.getInstance();
const internalJobsService = InternalJobsService.getInstance();
const externalJobsService = ExternalJobSearchService.getInstance();


export default class Welcome extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            biz: null,
            internalJobs: null,
            externalJobs: null
        }
    }

    //=================================================================================

    renderSavedJobs(job, index, inOrEx) {

        if (inOrEx === "in") {
            return <tr className="d-flex" key={index}>
                <td className="col-6">
                    <Link to={`/details/${job.id}`}
                          style={{color: 'black'}}>{job.title}</Link></td>
                <td className="col-6">
                    {job.description}
                </td>
            </tr>;
        } else {
            return <tr className="d-flex" key={index}>
                <td className="col-6">
                    <Link to={`/details/${job.id}`}
                          style={{color: 'black'}}>{job.title}</Link></td>
                <td className="col-6">
                    {job.company}
                </td>
            </tr>;
        }
    }

    //---------------------------------------------------------------------------------

    renderBusiness(biz, key) {
        return <tr key={key}>
            <td><Link to={"/mgr/" + biz.id}>{biz.name}</Link></td>
        </tr>
    }

    //=================================================================================

    getUser() {
        httpService.receiveSessionProfile().then((user) => {
            this.setState({user: user})
        });
    }

    //--------------------------------------------------------------------------------

    getBiz(bizId) {
        bizService.getBiz(Number(bizId)).then((biz) => {
            this.setState({biz: biz})
        })
    }

    //--------------------------------------------------------------------------------

    getAllBusinesses() {
        bizService.getAllBusinesses().then((businesses) => {
            this.setState({businesses: businesses})
        })
    }

    //--------------------------------------------------------------------------------

    getInternalJobs(userId) {
        if (userId !== null) {
            internalJobsService.getInternalJobsById(userId).then((jobsArr) => {
                this.setState({internalJobs: jobsArr})
            })
        }
    }

    //--------------------------------------------------------------------------------

    getExternalJobs(userId) {
        if (userId !== null) {
            externalJobsService.getJobsForUser(userId).then((jobsArr) => {
                this.setState({externalJobs: jobsArr})
            })
        }
    }

    //===================================================================================

    render() {
        if (!this.state.user)
            this.getUser();
        else {
            if (!this.state.internalJobs)
                this.getInternalJobs(this.state.user.id);
            if (!this.state.externalJobs)
                this.getExternalJobs(this.state.user.id);
        }
        if (!this.state.businesses) {
            this.getAllBusinesses();
        }
        return <div className="container-fluid">
            {this.state.user && <Router>
                <Navbar/>
                <Switch>
                    <Route path="/search/:jobWord" render={() => <JobSearchList user={this.props.user}/>}/>
                    <Route path="/search" render={() => <BountyMgr/>}/>
                    <Route path="/details/:jobId" render={() => <JobDetails/>}/>
                    <Route path="/job-list" render={() => <InternalJobList/>}/>
                    <Route path="/post/" render={() => <div><h1>Welcome to Bountium</h1><BountyMgr/></div>}/>
                    <Route path="/new" render={() => <NewBusinessWorkflow user={this.state.user}/>}/>
                    <Route path="/migrating" render={() => <MigratingBusinessWorkflow/>}/>
                    <Route path="/returning" render={() => <Login/>}/>
                    <Route path="/login" render={() => <Login/>}/>
                    <Route path="/register" render={() => <Register/>}/>
                    <Route path="/profile/:profileId" render={() => <ProfileViewOnly/>}/>
                    <Route path="/profile" render={() => <Profile user={this.state.user}/>}/>
                    <Route path="/mgr/:bizAddr" render={() => {
                        if (!this.state.biz)
                            this.getBiz(window.location.href.split("/")[4])
                        /* TODO use bizService.getBiz to get a biz object*/
                        return <div>{this.state.biz && <BizMgr user={this.state.user} biz={this.state.biz}/>}</div>
                    }}/>
                    <Route path="/" render={() => {
                        return <div>
                            <h3>Welcome{this.state.user.firstName !== "null" ? " " + this.state.user.firstName : "!"}</h3>
                            <div className="row">
                                <div className="col-6">
                                    <div className="container-fluid mt-1">
                                        <Link to={`/new/`} className="btn btn-primary">
                                            Start a new business
                                        </Link>
                                    </div>
                                    <div className="container-fluid mt-1">
                                        <Link to={`/search/`} className="btn btn-info">
                                            Search for jobs
                                        </Link>
                                    </div>
                                </div>
                                {this.state.businesses && <div className="col-6 float-right">
                                    <h4>Browse businesses</h4>
                                    {/*TODO pulled liked businesses from profile*/}
                                    <table>
                                        <tbody>
                                        {this.state.businesses.map(this.renderBusiness)}
                                        </tbody>
                                    </table>
                                </div>}
                                <div className="container-fluid">
                                    {this.state.user.username !== "null" && <div className="row mt-1">
                                        {this.state.internalJobs && <div className="col-6">
                                            <legend>Saved Internal Jobs</legend>
                                            <table>
                                                <tbody>
                                                {this.state.internalJobs.map((job, index) =>
                                                    this.renderSavedJobs(job, index, "in"))}
                                                </tbody>
                                            </table>
                                        </div>}
                                        {this.state.externalJobs && <div className="col-6">
                                            <legend>Saved External Jobs</legend>
                                            <table>
                                                <tbody>
                                                {this.state.externalJobs.map((job, index) =>
                                                    this.renderSavedJobs(job, index, "ex"))}
                                                </tbody>
                                            </table>
                                        </div>}
                                    </div>}
                                </div>
                            </div>
                        </div>
                    }}/>
                </Switch>
            </Router>}
        </div>
    }
}

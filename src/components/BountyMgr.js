import React from 'react'
import {Link} from "react-router-dom";
import UserJobsService from '../services/UserJobsService';
const userJobsService = UserJobsService.getInstance();

export default class BountyMgr extends React.Component {

  constructor(props) {
      super(props);
      this.state = {value: "PYTHON", postedJobId: "none"}
      this.postInternalJob = this.postInternalJob.bind(this);
  }

  updateCategory(value) {
      this.setState( {value: value});
  }

  postInternalJob() {
    userJobsService.postInternalJob(
      {title : document.getElementById("bounty-title").value,
      description : document.getElementById("bounty-description").value}).then(
      postedJob => this.setState({postedJobId : postedJob.id})
    );
  }

  render() {
    if (this.state.postedJobId !== "none") {
      return <div className="container-fluid jumbotron">
        <h3>Success! View your job <Link to={"/details/" + this.state.postedJobId}>here</Link></h3>
      </div>
    }
    return (
      <div className="container-fluid jumbotron">
        <div className="row">
          <div className="col-12">
            <h3>Search for jobs, or post your own</h3>
            <div className="form">
              <div className="form-group">
                <label htmlFor="jobCategory">Category</label>
                <select id="jobCategory" className="form-control"
                        onChange={() => this.updateCategory(document.getElementById("jobCategory").value)}>
                  <option value="PYTHON">Python</option>
                  <option value="JAVA">Java</option>
                  <option value="HTML">Html/CSS</option>
                  <option value="SQL">SQL</option>
                </select>
              <Link to={`/search/${this.state.value}`}>
                See jobs in this category from Github</Link>
              </div>
              <div className="form-group">
                <label htmlFor="bounty-title">Job Title</label>
                <input id="bounty-title" className="form-control" placeholder="Junior Python Developer Intern">
                </input>
              </div>
              <div className="form-group">
                <label htmlFor="bounty-description">Job Description</label>
                <textarea className="form-control" id="bounty-description"
                          placeholder="Coffee intern needed to ensure execs remain thoroughly caffeinated.">
                </textarea>
              </div>
              <button className="btn btn-primary"
                      onClick={this.postInternalJob}>
                Post to Bountium's job board
              </button>
            </div>
            {/* TODO render the business's active bounties here
              // including internal ops per keiths request!*/}
          </div>
        </div>
      </div>
    )
  }

}

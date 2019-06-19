import React from 'react';
import {Link} from 'react-router-dom'
import BusinessService from '../services/BusinessService';
import OwnerService from '../services/OwnerService';
const bizService = BusinessService.getInstance();
const ownerService = OwnerService.getInstance();

export default class NewBusinessWorkflow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bizId : "0x0"
    }
  }

  newBiz() {
    var bizId;
    bizService.createBiz(
      {
        name : document.getElementById("bizname").value,
        description : document.getElementById("biz-descript").value,
        totalShares : Number(document.getElementById("total-shares").value),
        orgFunds : 4567
      }
    ).then((biz) => {
      bizId = biz.id;
      ownerService.createOwnerForBiz({
        username:this.props.user.username, shares:Number(document.getElementById("shares-for-self").value),
        dividend : true, dilute : true, bestow : true, modifyCatalogue : true, board : true
      }, biz.id).then((biz) => this.setState({bizId : bizId}));
    })
  }

  render() {
    if (this.state.bizId !== "0x0") {
      return <p>Success! Go manage your business <Link to={`/mgr/${this.state.bizId}`}>here</Link></p>
    }
    return (
      <div>
        <h5>Create a new business</h5>
        <div className="container">
          <div className = "form">
            <div className="form-group">
              <label htmlFor="bizname"
                     className="col-form-label">
                  Business Name </label>
              <input className="form-control"
                     id="bizname"
                     placeholder="Mike's Munchy Mangoes"/>
            </div>
            <div className="form-group">
              <label htmlFor="shares-for-self"
                     className="col-form-label">
                  Shares for yourself </label>
              <input type="number"
                     className="form-control"
                     id="shares-for-self"/>
            </div>
            <div className="form-group">
              <label htmlFor="total-shares"
                     className="col-form-label">
                  Total Shares </label>
              <input type="number"
                     className="form-control"
                     id="total-shares"/>
            </div>
            <div className="form-group">
              <label htmlFor="shares"
                     className="col-form-label">
                  Describe the business </label>
              <textarea id="biz-descript" className="form-control mb-1" />
            </div>
            <button
                onClick={() => this.newBiz()}
                type="button"
                className="btn btn-block btn-primary">
                Sign Up
            </button>
        </div>
        </div>
      </div>
    );
  }

}

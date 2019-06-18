import React from 'react';
import ChatClient from './ChatClient';

export default class BizMgr extends React.Component {

  mapProducts(product, key) {
    return <div className="card" key={key} id={"product-" + key}>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.price}</p>
      </div>
    </div>
  }

  mapOwners(owner, key) {
    return <p key={key}>{owner.name}</p>
  }

  fundBiz() {

  }

  modifyBizDetails() {

  }

  render() {
    return (
      <div>
        <h2>{this.props.biz.name}</h2>
        <div className="container-fluid jumbotron">
          <h5>Business Details</h5>
          <p>{"Description: " + this.props.biz.description}</p>
          <ul>Tags:
            {this.props.biz.tags.map((tag, key) => <li key={key}>{tag}</li>)}
          </ul>
          <button className="btn btn-primary float-right" onClick={this.modifyBizDetails}>Modify</button>
        </div>
        <div className="container-fluid jumbotron bg-white">
          <h3>Your products</h3>
          <div className="card-deck">
            {this.props.biz.products.map(this.mapProducts)}
          </div>
        </div>
        <div className="container-fluid jumbotron">
          <h3>Your Organisation</h3>
          <div className="">
            <div className="row border">
              <div className="col-6 mb-2 mt-1">
                <h4>Organisation funds</h4>
                <p>{"Current organisation balance: " + this.props.biz.orgFunds + " wei"}</p>
                <div className="form">
                  <legend>Send funds to the organisation</legend>
                  <div className="form-group">
                    <label htmlFor="org-funding-amt-input">Amount to send organisation, in wei:</label>
                    <input type="number" className="form-control" id="org-funding-amt-input"/>
                  </div>
                  <button className="btn btn-primary" onClick={this.fundBiz}>Send funds</button>
                </div>
              </div>
              <div className="col-6 mb-2 mt-1">
                <h4>Ownership and shares</h4>
                <p>{
                  "Your stake: " + this.props.biz.shares + " shares of "
                    + this.props.biz.totalShares + " total shares, for a stake of "
                    + ((this.props.biz.shares / this.props.biz.totalShares) * 100) + "%"
                }</p>
                <p>Owners:</p>
                {this.props.biz.owners.map(this.mapOwners)}
                <div className="form">
                  <legend>Transfer your shares</legend>
                  <div className="form-group">
                    <label htmlFor="transfer-shares-amt-input">Amount of shares to transfer:</label>
                    <input type="number" className="form-control" id="transfer-shares-amt-input"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="transfer-shares-addr-input">Address of new owner:</label>
                    <input type="text" className="form-control" id="transfer-shares-addr-input"/>
                  </div>
                  <button className="btn btn-primary" onClick={this.transfer}>Transfer shares</button>
                </div>
              </div>
            </div>
            {this.props.biz.dilute && <div className="row border">
              <div className="form col-6 mb-2 mt-1">
                <legend>Give unallocated shares</legend>
                <div className="form-group">
                  <label htmlFor="give-shares-amt-input">Amount of shares to give:</label>
                  <input type="number" className="form-control" id="give-shares-amt-input"/>
                </div>
                <div className="form-group">
                  <label htmlFor="give-shares-addr-input">Address of new owner:</label>
                  <input type="text" className="form-control" id="give-shares-addr-input"/>
                </div>
                <button className="btn btn-primary" onClick={this.giveUnallocated}>Give shares</button>
              </div>
              <div className="form col-6 mb-2 mt-1">
                <legend>Give new shares, diluting current owners</legend>
                <div className="form-group">
                  <label htmlFor="dilute-shares-amt-input">Amount of shares to create and give:</label>
                  <input type="number" className="form-control" id="dilute-shares-amt-input"/>
                </div>
                <div className="form-group">
                  <label htmlFor="dilute-shares-addr-input">Address of new owner:</label>
                  <input type="text" className="form-control" id="dilute-shares-addr-input"/>
                </div>
                <button className="btn btn-primary" onClick={this.dilute}>Create and give shares</button>
              </div>
              </div>
            }
            <div className="row border">
              {this.props.biz.bestow &&
                <div className="col-6 mb-2 mt-1">
                  <legend>Bestow permissioned roles to a co-owner:</legend>
                  <div className="form-group">
                    <label htmlFor="give-permission-addr-input">Address of bestowee:</label>
                    <input type="text" className="form-control" id="give-permission-addr-input"/>
                  </div>
                  <select className="form-control">
                    <option value={1}>Can call dividends</option>
                    <option value={2}>Can dilute shares</option>
                    <option value={3}>Can give other co-owners permissions</option>
                    <option value={4}>Can release/modify products</option>
                    <option value={5}>Is a board member</option>
                  </select>
                  <button className="btn btn-primary mt-1" onClick={this.givePermission}>Give permission</button>
                </div>
              }
              {this.props.biz.dividend &&
                <div className="form col-6 mb-2 mt-1">
                  <legend>Call for a new dividend</legend>
                  <div className="form-group">
                    <label htmlFor="dividend-amt-input">Wei per share:</label>
                    <input type="number" className="form-control" id="dividend-amt-input"/>
                    <button className="btn btn-primary mt-1" onClick={this.callDividend}>Call for a dividend</button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        <ChatClient bizId={this.props.biz.id}/>
      </div>
    );
  }
}

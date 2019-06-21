import React from 'react';
import ChatClient from './ChatClient';
import BizDetails from './BizDetails';
import BountyMgr from './BountyMgr'
import ProductEditor from './ProductEditor';
import {Link} from 'react-router-dom'
import BusinessService from '../services/BusinessService';
import OwnerService from '../services/OwnerService';
import ProductService from '../services/ProductService';
const bizService = BusinessService.getInstance();
const ownerService = OwnerService.getInstance();
const productService = ProductService.getInstance();

export default class BizMgr extends React.Component {

  // TODO one day make the chat appear as a popover on the side/bottom,
  // and put collaboration in operations tab

  constructor(props) {
    super(props);
    this.state = {
      viewingOrg : true,
      viewingProducts : false,
      viewingOps : false,
      viewingChat : false,
      // The permissions of the current user
      currentOwner : this.props.biz.owners.filter(owner => owner.username === this.props.user.username)[0],
      selectedProduct : -1,
      update : false,
      products : this.props.biz.products,
      owners : this.props.biz.owners
    }
    this.viewProducts = this.viewProducts.bind(this);
    this.viewOrg = this.viewOrg.bind(this);
    this.viewOps = this.viewOps.bind(this);
    this.viewChat = this.viewChat.bind(this);
    this.mapProducts = this.mapProducts.bind(this);
    this.selectProduct = this.selectProduct.bind(this);
    this.giveShares = this.giveShares.bind(this);
    this.dilute = this.dilute.bind(this);
    this.transfer = this.transfer.bind(this);
    this.givePermission = this.givePermission.bind(this);
    this.giveUnallocated = this.giveUnallocated.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    // TODO these can be unbound once we start using the service
    this.newProduct = this.newProduct.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateOwners = this.updateOwners.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }

  viewProducts() {
    this.setState({viewingProducts : true})
    this.setState({viewingOrg : false})
    this.setState({viewingOps : false})
    this.setState({viewingChat : false})
  }

  viewOrg() {
    this.setState({viewingProducts : false})
    this.setState({viewingOrg : true})
    this.setState({viewingOps : false})
    this.setState({viewingChat : false})
  }

  viewOps() {
    this.setState({viewingProducts : false})
    this.setState({viewingOrg : false})
    this.setState({viewingOps : true})
    this.setState({viewingChat : false})
  }

  viewChat() {
    this.setState({viewingProducts : false})
    this.setState({viewingOrg : false})
    this.setState({viewingOps : false})
    this.setState({viewingChat : true})
  }

  selectProduct(e) {
    this.setState({selectedProduct : Number(e.target.id)})
  }

  mapProducts(product, key) {
    if (key === this.state.selectedProduct) {
      console.log(this.state.products);
      return <ProductEditor productIndex={this.state.selectedProduct}
                            bizId={this.props.biz.id}
                            key={key}
                            product={product}
                            done={(newProducts) => {
                              console.log(newProducts);
                              this.setState({selectedProduct : -1});
                              if (newProducts != this.state.products && newProducts != null)
                                this.setState({products:newProducts});
                            }}/>
    }
    return <div className="border mx-auto col-4" key={key} id={"product-" + key}>
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.price}</p>
          <button id={key} className="btn btn-primary" onClick={this.selectProduct}>Edit</button>
          <button id={key} className="btn btn-warning" onClick={this.deleteProduct}>Delete</button>
        </div>
      </div>
  }

  deleteProduct(e) {
    productService.deleteProduct(this.props.biz.id, Number(e.target.id)).then((newProducts) =>
      this.setState({products : newProducts})
    )
    // changing meaningless state var to force re render:
    this.setState({update : !this.state.update})
  }

  mapProductsToNonOwner(product, key) {
    return <div className="card" key={key} id={"product-" + key}>
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.price}</p>
      </div>
    </div>
  }

  mapOwners(owner, key) {
    return <Link className="col-12" to={"/profile/" + owner.username} key={key}>{owner.username}</Link>
  }

  // modifying the business //

  // Financials:
  fundBiz() {

  }

  callDividend() {

  }

  // Owner stuff:
  transfer() {
    var amt = Number(document.getElementById("transfer-shares-amt-input").value);
    var currentOwners = this.state.owners;
    var transferringOwner = currentOwners.filter(owner => this.state.currentOwner.username === owner.username)[0];
    if (transferringOwner.shares < amt) {
      // TODO dont let them transfer, notify them of the mistake
      return;
    }
    transferringOwner.shares -= amt;
    this.giveShares(document.getElementById("transfer-shares-addr-input").value, amt);
  }

  dilute() {
    var amt = Number(document.getElementById("dilute-shares-amt-input").value);
    if (!this.state.currentOwner.dilute) {
      // TODO dont let them transfer, notify them of the mistake
      return;
    }
    this.giveShares(document.getElementById("dilute-shares-addr-input").value, amt);
    this.props.biz.totalShares += amt;
    bizService.updateBiz({
      totalShares : this.props.biz.totalShares,
      ...this.props.biz
    }, this.props.biz.id)
  }

  giveUnallocated() {
    var amt = Number(document.getElementById("give-shares-amt-input").value);
    var currentOwners = this.state.owners;
    var takenShares = currentOwners.reduce((sharesAddedSoFar, nextOwner) => sharesAddedSoFar + nextOwner.shares);
    if ((this.props.totalShares - takenShares) < amt || !this.state.currentOwner.dilute) {
      // TODO dont let them dilute, notify them of the mistake
      return;
    }
    this.giveShares(document.getElementById("give-shares-addr-input").value, amt);
  }

  giveShares(recipient, amt) {
    var currentOwners = this.state.owners;
    var searchCurrentOwners = currentOwners.filter(owner => owner.username === recipient);
    if (searchCurrentOwners.length > 0) {
      // Give shares to one of the current owners
      // TODO does mutating this specific variable actually change the currentOwner
      // var or do we need to do currentOwners[x] = mutated?
      searchCurrentOwners[0].shares += amt;
    } else {
      // Add the new owner
      currentOwners.push({
       username:recipient, shares:amt,
       dividend : false, dilute : false, bestow : false, modifyCatalogue : false, board : false
      });
    }
    this.updateOwners(currentOwners);
  }

  // TODO this don't work
  givePermission() {
    var recipient = document.getElementById("give-permission-addr-input").value;
    var role = document.getElementById("give-permission-value-input").value;
    var currentOwners = this.state.owners;
    var bestowee = currentOwners.filter(owner => owner.username === recipient)[0];
    switch(role) {
      // TODO does mutating bestowee actually change the currentOwner
      // var or do we need to do currentOwners[x] = mutated?
      case 1:
        bestowee.dividend = true;
        break;
      case 2:
        bestowee.dilute = true;
        break;
      case 3:
        bestowee.bestow = true;
        break;
      case 4:
        bestowee.modifyCatalogue = true;
        break;
      case 5:
        bestowee.board = true;
        break;
      default:
        // TODO this will never happen, prolly throw an error;
        return;
    }
    this.updateOwners(currentOwners);
  }

  // Sending updates out:
  // (TODO these should all use the service to send a new biz object to the backend)
  updateOwners(newOwnersArr) {
    // TODO use the service to send this change somewhere, testing for now:
    for (let i = 0; i < newOwnersArr.length; i++) {
      ownerService.updateOwnerForBiz(this.props.biz.id, i, newOwnersArr[i]).then((newOwners) => {
        this.setState({owners : newOwners})
        this.setState({currentOwner : newOwners.filter(owner => owner.username === this.props.user.username)[0]})
      })
    }
  }

  updateName(newName) {
    // TODO use the service to send this change somewhere, testing for now:
    this.props.biz.name = newName;
    bizService.updateBiz({
      name : newName,
      ...this.props.biz
    }, this.props.biz.id)
    // changing meaningless state var to force re render:
    this.setState({update : !this.state.update})
  }

  updateDescription(newDescription) {
    // TODO use the service to send this change somewhere, testing for now:
    this.props.biz.description = newDescription;
    bizService.updateBiz({
      description : newDescription,
      ...this.props.biz
    }, this.props.biz.id)
    // changing meaningless state var to force re render:
    this.setState({update : !this.state.update})
  }

  newProduct() {
    // TODO use the service to send this change somewhere, testing for now:
    productService.createProductForBiz({name:'new product', price:0}, this.props.biz.id).then((updatedProducts) => {
      this.setState({products : updatedProducts})
    });
  }

  // TODO get and render the jobs this business has posted below the bountyMgr

  render() {
    if (this.state.owners.filter(owner => owner.username === this.props.user.username).length == 0 ) {
      return (<div>
        <h2>{this.props.biz.name}</h2>
        <div>
          <ul className="nav navbar">
            <li className={"nav-item display-4 col-6" + (this.state.viewingOrg ? " border-bottom" : "")} onClick={this.viewOrg}>
              <h4 className="text-center">Organisation</h4>
            </li>
            <li className={"nav-item display-4 col-6" + (this.state.viewingProducts ? " border-bottom" : "")} onClick={this.viewProducts}>
              <h4 className="text-center">Products</h4>
            </li>
          </ul>
        </div>
        {this.state.viewingOrg && <div>
          <BizDetails biz={this.props.biz}
                      isOwner={false}/>
        </div>}
        {this.state.viewingProducts && <div className="container-fluid jumbotron bg-white">
          <h3>Your products</h3>
          {this.state.products && <div className="w-100 d-block">
            {this.state.products.map(this.mapProductsToNonOwner)}
          </div>}
        </div>}
      </div>
    );
    }
    return (
      <div>
        <h2>{this.props.biz.name}</h2>
        <div>
          <ul className="nav navbar">
            <li className={"nav-item display-4 col-3" + (this.state.viewingOrg ? " border-bottom" : "")} onClick={this.viewOrg}>
              <h4 className="text-center">Organisation</h4>
            </li>
            <li className={"nav-item display-4 col-3" + (this.state.viewingProducts ? " border-bottom" : "")} onClick={this.viewProducts}>
              <h4 className="text-center">Products & Supply Chains</h4>
            </li>
            <li className={"nav-item display-4 col-3" + (this.state.viewingOps ? " border-bottom" : "")} onClick={this.viewOps}>
              <h4 className="text-center">Operations</h4>
            </li>
            <li className={"nav-item display-4 col-3" + (this.state.viewingChat ? " border-bottom" : "")} onClick={this.viewChat}>
              <h4 className="text-center">Chat & Collaboration</h4>
            </li>
          </ul>
        </div>
        {this.state.viewingOrg && <div>
          <BizDetails biz={this.props.biz}
                      updateName={this.updateName}
                      updateDescription={this.updateDescription}
                      isOwner={true}/>
          <div className="container-fluid jumbotron">
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
                    "Your stake: " + this.state.currentOwner.shares + " shares of "
                      + this.props.biz.totalShares + " total shares, for a stake of "
                      + ((this.state.currentOwner.shares / this.props.biz.totalShares) * 100) + "%"
                  }</p>
                  <p>Owners:</p>
                  {this.state.owners.map(this.mapOwners)}
                  <div className="form">
                    <legend>Transfer your shares</legend>
                    <div className="form-group">
                      <label htmlFor="transfer-shares-amt-input">Amount of shares to transfer:</label>
                      <input type="number" className="form-control" id="transfer-shares-amt-input"/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="transfer-shares-addr-input">Username of new owner:</label>
                      <input type="text" className="form-control" id="transfer-shares-addr-input"/>
                    </div>
                    <button className="btn btn-primary" onClick={this.transfer}>Transfer shares</button>
                  </div>
                </div>
              </div>
              {this.state.currentOwner.dilute && <div className="row border">
                <div className="form col-6 mb-2 mt-1">
                  <legend>Give unallocated shares</legend>
                  <div className="form-group">
                    <label htmlFor="give-shares-amt-input">Amount of shares to give:</label>
                    <input type="number" className="form-control" id="give-shares-amt-input"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="give-shares-addr-input">Username of new owner:</label>
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
                    <label htmlFor="dilute-shares-addr-input">Username of new owner:</label>
                    <input type="text" className="form-control" id="dilute-shares-addr-input"/>
                  </div>
                  <button className="btn btn-primary" onClick={this.dilute}>Create and give shares</button>
                </div>
                </div>
              }
              <div className="row border">
                {this.state.currentOwner.bestow &&
                  <div className="col-6 mb-2 mt-1">
                    <legend>Bestow permissioned roles to a co-owner:</legend>
                    <div className="form-group">
                      <label htmlFor="give-permission-addr-input">Username of bestowee:</label>
                      <input type="text" className="form-control" id="give-permission-addr-input"/>
                    </div>
                    <select className="form-control" id="give-permission-value-input">
                      <option value={1}>Can call dividends</option>
                      <option value={2}>Can dilute shares</option>
                      <option value={3}>Can give other co-owners permissions</option>
                      <option value={4}>Can release/modify products</option>
                      <option value={5}>Is a board member</option>
                    </select>
                    <button className="btn btn-primary mt-1" onClick={this.givePermission}>Give permission</button>
                  </div>
                }
                {this.state.currentOwner.dividend &&
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
        </div>}
        {this.state.viewingProducts && <div className="container-fluid jumbotron bg-white">
          <h3>Your products</h3>
          {this.state.products && <div className="card-deck">
            {this.state.products.map(this.mapProducts)}
          </div>}
          <button className="btn btn-primary mt-1 float-right" onClick={this.newProduct}>New Product</button>
        </div>}
        {this.state.viewingOps && <div className="container-fluid">
          <BountyMgr/>
        </div>
        }
        {this.state.viewingChat && <ChatClient msgs={this.props.biz.msgs}/>}
      </div>
    );
  }
}

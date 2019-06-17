import React from 'react'
import PostingPage from './PostingPage'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import JobSearchList from './JobSearchList'
import Navbar from './Navbar'
import NewBusinessWorkflow from './NewBusinessWorkflow'
import MigratingBusinessWorkflow from './MigratingBusinessWorkflow'
import ReturningBusinessWorkflow from './ReturningBusinessWorkflow'
import Login from './users/Login'
import Register from './users/Register'
import BizMgr from './BizMgr'
import Web3 from 'web3';

const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

const autobizABI = web3.eth.Contract([{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"owners","outputs":[{"name":"name","type":"string"},{"name":"stake","type":"uint256"},{"name":"callsDividend","type":"bool"},{"name":"canDilute","type":"bool"},{"name":"canBestow","type":"bool"},{"name":"canModifyCatalogue","type":"bool"},{"name":"board","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"product","type":"uint256"},{"name":"orderID","type":"uint256"}],"name":"checkOrderStatus","outputs":[{"name":"stepsCompleted","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"biz_name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"catalogue","outputs":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"imageURL","type":"string"},{"name":"forSale","type":"bool"},{"name":"price","type":"uint256"},{"name":"ordersReceived","type":"uint256"},{"name":"supplyChainLength","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amt","type":"uint256"}],"name":"payDividend","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"isOwner","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"supplyChains","outputs":[{"name":"description","type":"string"},{"name":"incentiviser","type":"address"},{"name":"fee","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"evaluator","type":"address"},{"name":"fee","type":"uint256"}],"name":"addSupplyStep","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"orderID","type":"uint256"}],"name":"paySuppliersForOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"equityTaken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bestowee","type":"address"},{"name":"which","type":"uint256"}],"name":"bestowPermission","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sharesToTransfer","type":"uint256"},{"name":"recipient","type":"address"}],"name":"transferShares","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"b32","type":"bytes32"}],"name":"bytes32ToBytes","outputs":[{"name":"b","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"step","type":"uint256"}],"name":"paySupplier","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"shares","type":"uint256"},{"name":"recipient","type":"address"}],"name":"giveUnallocatedShares","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"}],"name":"listProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"uint256"}],"name":"uintToBytes","outputs":[{"name":"b","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"newPrice","type":"uint256"}],"name":"changePrice","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"description_","type":"string"}],"name":"addDescription","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"orders","outputs":[{"name":"complete","type":"bool"},{"name":"suppliersPaid","type":"bool"},{"name":"customerData","type":"string"},{"name":"stepsCompleted","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"price","type":"uint256"}],"name":"releaseProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"imageURL_","type":"string"}],"name":"addImageUrl","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"name_","type":"string"}],"name":"setMyName","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"},{"name":"customerInfo","type":"string"}],"name":"order","outputs":[{"name":"orderPlaced","type":"bool"},{"name":"delivered","type":"address"},{"name":"orderID","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ownersRegistered","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"source","type":"string"}],"name":"stringToBytes","outputs":[{"name":"result","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"stake","type":"uint256"},{"name":"recipient","type":"address"}],"name":"dilute","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"product","type":"uint256"}],"name":"delistProduct","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"equityToSender","type":"uint256"},{"name":"_totalShares","type":"uint256"},{"name":"_name","type":"string"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"}],"name":"OwnershipModified","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"},{"indexed":false,"name":"productID","type":"uint256"}],"name":"ProductReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"byWhom","type":"address"},{"indexed":false,"name":"productID","type":"uint256"}],"name":"ProductModified","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"productID","type":"uint256"},{"indexed":false,"name":"orderID","type":"uint256"}],"name":"OrderReceived","type":"event"}]);

export default class Welcome extends React.Component {

  render() {
    return <div className="container-fluid">
        <Router>
          <Navbar/>
          <Switch>
            <Route path="/post/" render={() => <PostingPage/>}/>
            <Route path="/job-search-list/:jobWord" render={() => <JobSearchList/>}/>
            <Route path="/new" render={() => <NewBusinessWorkflow/>}/>
            <Route path="/migrating" render={() => <MigratingBusinessWorkflow/>}/>
            <Route path="/returning" render={() => <ReturningBusinessWorkflow/>}/>
            <Route path="/login" render={() => <Login/>}/>
            <Route path="/register" render={() => <Register/>}/>
            <Route path="/mgr/:bizAddr" render={() => {
              {
                /* TODO give it a business object, either from the contract or backend,
                   with all the fields in the below object
                  // TODO this breaks - 'abi.forEach is not a function'
                  bizContract : new web3.eth.Contract(autobizABI, window.location.href.split('/')[4])
                */
              }
              console.log(window.location.href.split('/')[4]);
              return <BizMgr biz={
                {
                  name : "Steve's Salacious Spaghetti Store",
                  description : "We sell the finest spaghetti in Essex county. From stringy, to not stringy, spaghetti, and including all varieties known to man. We grow our spaghetti free-range and cruelty free, and let it roam wild in its youth.",
                  shares : 1,
                  totalShares : 2,
                  dividend : true,
                  dilute : true,
                  bestow : true,
                  modifyCatalogue : true,
                  board : true,
                  orgFunds : 'hella',
                  owners : [{name:'you', address:window.location.href.split('/')[4], shares:1}, {name:'john', address:'0x4cA1B904FC9f15Ec050108C0FfB3FB5Ba48c5510', shares:1}],
                  products : [{name:'weenie', price:1}, {name:'hot dog', price:2}]
                }
              }/>
            }}/>
            <Route path="/"
                   render={() => <div>
                     <h3>Welcome - lets work on your business!</h3>
                     {/* new business starter button */}
                     <div className="container-fluid mt-1">
                       <Link to={`/new/`} className="btn btn-primary">
                         Start a new business
                       </Link>
                     </div>
                     {/* existing business migrater button */}
                     <div className="container-fluid mt-1">
                       <Link to={`/migrating/`} className="btn btn-info">
                         Convert your existing business to Bountium
                       </Link>
                     </div>
                     {/* returning user login */}
                     <div className="container-fluid mt-1">
                       <Link to={`/returning/`} className="btn btn-success">
                         Log in and manage your Bountium business
                       </Link>
                     </div>
                     </div>
                   }/>
          </Switch>
        </Router>
      </div>
  }

}

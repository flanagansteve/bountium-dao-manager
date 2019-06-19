import React from 'react'

export default class BizDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing : false,
      biz : {
        name : this.props.biz.name,
        description : this.props.biz.description
      }
    }
    this.modifyBizDetails = this.modifyBizDetails.bind(this);
    this.saveBizDetails = this.saveBizDetails.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateDescription = this.updateDescription.bind(this);
  }

  updateName(e) {
    this.setState({biz: {
      name : e.target.value,
      description : this.state.biz.description
    }})
  }

  updateDescription(e) {
    this.setState({biz: {
      name : this.state.biz.name,
      description : e.target.value
    }})
  }

  modifyBizDetails() {
    this.setState({editing : true});
  }

  saveBizDetails() {
    this.setState({editing : false});
    if (this.state.biz.name !== this.props.biz.name)
      this.props.updateName(this.state.biz.name);
    if (this.state.biz.description !== this.props.biz.description)
      this.props.updateDescription(this.state.biz.description);
  }

  render() {
    if (!this.props.isOwner) {
      return (
        <div className="container-fluid jumbotron">
          <h5>Business Details</h5>
          <div className="form-group">
            <label htmlFor="bizdescript">Name</label>
            <p id="bizdescript">{this.props.biz.name}</p>
          </div>
          <div className="form-group">
            <label htmlFor="bizdescript">Description</label>
            <p id="bizdescript">{this.props.biz.description}</p>
          </div>
        </div>);
    }
    if (!this.state.editing) {
      return (
        <div className="container-fluid jumbotron">
          <h5>Business Details</h5>
          <div className="form-group">
            <label htmlFor="bizdescript">Name</label>
            <p id="bizdescript">{this.props.biz.name}</p>
          </div>
          <div className="form-group">
            <label htmlFor="bizdescript">Description</label>
            <p id="bizdescript">{this.props.biz.description}</p>
          </div>
          <button className="btn btn-primary float-right" onClick={this.modifyBizDetails}>Modify</button>
        </div>);
    }
    return (
      <div className="container-fluid jumbotron">
        <h5>Business Details</h5>
        <div className="form-group">
          <label htmlFor="bizdescript">Name</label>
          <input className="form-control mb-1" value={this.state.biz.name} onChange={this.updateName}/>
        </div>
        <div className="form-group">
          <label htmlFor="bizdescript">Description</label>
          <textarea className="form-control mb-1" value={this.state.biz.description} onChange={this.updateDescription} />
        </div>
        <button className="btn btn-primary float-right" onClick={this.saveBizDetails}>Save</button>
      </div>
    );
  }

}

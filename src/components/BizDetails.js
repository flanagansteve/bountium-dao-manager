import React from 'react'

export default class BizDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      editing : false,
      biz : {
        name : this.props.biz.name,
        description : this.props.biz.description,
        tags : this.props.biz.tags
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
      description : this.state.biz.description,
      tags : this.state.biz.tags
    }})
  }

  updateDescription(e) {
    this.setState({biz: {
      name : this.state.biz.name,
      description : e.target.value,
      tags : this.state.biz.tags
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
    if (!this.state.editing) {
      return (
        <div className="container-fluid jumbotron">
          <h5>Business Details</h5>
          <p>{"Description: " + this.props.biz.description}</p>
          <ul>Tags:
            {this.props.biz.tags.map((tag, key) => <li key={key}>{tag}</li>)}
          </ul>
          <button className="btn btn-primary float-right" onClick={this.modifyBizDetails}>Modify</button>
        </div>);
    }
    return (
      <div className="container-fluid jumbotron">
        <input className="form-control mb-1" value={this.state.biz.name} onChange={this.updateName}/>
        <textarea className="form-control mb-1" value={this.state.biz.description} onChange={this.updateDescription} />
        {/*TODO tags*/}
        <button className="btn btn-primary float-right" onClick={this.saveBizDetails}>Save</button>
      </div>);
  }

}

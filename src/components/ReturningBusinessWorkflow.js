import React from 'react'
import BizMgr from './BizMgr'
import Login from './users/Login'

export default class ReturningBusinessWorkflow extends React.Component {

  render() {
    return <div className="navbar navbar-expand">
          <Login/>
      </div>
  }

}

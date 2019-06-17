import React from 'react'
import BizMgr from './BizMgr'
import Register from './users/Register'

export default class MigratingBusinessWorkflow extends React.Component {

  render() {
    return <div className="navbar navbar-expand">
          <Register/>
      </div>
  }

}

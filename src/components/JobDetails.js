import React from 'react'

const JobDetails = ({jobObj}) =>
  <div>
    <h1>{jobObj.id}</h1>
    <h1>{jobObj.type}</h1>
    <h1>{jobObj.url}</h1>
    <h1>{jobObj.created_at}</h1>
    <h1>{jobObj.company}</h1>
    <h1>{jobObj.company_url}</h1>
    <h1>{jobObj.location}</h1>
    <h1>{jobObj.title}</h1>
    <div dangerouslySetInnerHTML={{__html: jobObj.description}} />
  </div>

export default JobDetails

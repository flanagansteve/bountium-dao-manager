import React from 'react'

// TODO why are bootstrap classes not working?

const JobDetails = ({jobObj}) =>
    <div className="jumbotron">
        <h1>{jobObj.title} - for: {jobObj.company_url != null && <a href={jobObj.company_url}>{jobObj.company}</a>}
            {jobObj.company_url == null && jobObj.company}</h1>
        <img src={jobObj.company_logo} className="float-right"/>
        <h1>{jobObj.type}</h1>
        <p>Posted at: {jobObj.created_at}</p>
        <p>Location: {jobObj.location}</p>
        <div dangerouslySetInnerHTML={{__html: jobObj.description}}/>
        <div dangerouslySetInnerHTML={{__html: jobObj.how_to_apply}}/>
    </div>;

// unused: job.id, job.url

export default JobDetails

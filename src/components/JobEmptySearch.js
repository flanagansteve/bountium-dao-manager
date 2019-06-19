import {Link} from "react-router-dom";
import React from "react";


const JobEmptySearch = () => {
    return (
        <div className="container-fluid">
            <h1> Job Search returned with no results.
                <span className="float-right">
                            <Link to="/home-page"> Back to Homepage </Link>
                    </span>
            </h1>
        </div>
    )
};

export default JobEmptySearch
import React, {useEffect} from "react";
import './style.css';

import {Link} from 'react-router-dom';

function Error(){

    return(
        <div className="container-not-found">
            <h1>404</h1>
            <h2>Page not found</h2>
            <Link to='/'>Return to Website</Link>
        </div>
    );
}

export default Error;


import React, {useState, useContext} from "react";
import './style.css';

import {Link, useLocation} from 'react-router-dom';
import {useNavigate } from 'react-router-dom';

import {AuthContext} from '../../../Contexts/auth';

function Warning(){

    const {signed, user} = useContext(AuthContext);
    const navigate = useNavigate();

    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email);
    const [title, setTitle] = useState(location.state?.title);
    const [message, setMessage] = useState(location.state?.message);

    function loadNextPage(){
        if(!signed || (user && !user.emailVerified)){
            navigate('/');
        } else{
            navigate('/home');
        }
    }

    return(
        <div className="mainContainer">
            <div className="warningContainer">
                <p>{title}</p>
                <p>{'( '}{email}{' )'}</p>
                <p>{message}</p>
                <button className="btnConfirm" onClick={loadNextPage}>OK</button>   
            </div>
        </div>
    );
}

export default Warning;
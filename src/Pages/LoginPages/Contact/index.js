import React, {useState, useContext} from "react";
import { CornerDownLeft } from "react-feather";
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import { ItemContext } from "../../../Contexts/itemIdContext";

import './style.css';
import logoSquare from '../../../img/slon-small.png';

function Contact(){
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [messageArea, setMessageArea] = useState('');

    const {handleSubmitMessage} = useContext(ItemContext);
    
    async function sendMessage(){
        
        if(name === '' || email === '' || subject === '' || messageArea === ''){
            toast.warn('All fields must be filled out!');
            return;
        }

        await handleSubmitMessage(name, email, subject, messageArea);

        setName('');
        setEmail('');
        setSubject('');
        setMessageArea('');
    }

    return(
        <div className="contactMainContainer">
            <div className="contactContainer">
                <div className="contactHeadercontainer">
                    <div>
                        <img
                            src={logoSquare}
                            alt="App Logo"
                        />
                        <h3> Contact us</h3>
                    </div>
                    
                    <p> <Link className="linkSingInBtn"to={"/"}> <CornerDownLeft id="iconCornerDown"/> Sign in </Link> </p>
                </div>
                <hr />
                <div className="contactInputContainer">
                    <input type="text" value={name} maxLength={40}placeholder="name" onChange={ e => setName(e.target.value)}/> <br/>

                    <input type="email" value={email} maxLength={30} placeholder="email" onChange={ e => setEmail(e.target.value)}/> <br/>

                    <input type="text" value={subject} maxLength={40}placeholder="subject" onChange={ e => setSubject(e.target.value)}/> <br/><br/>

                    <textarea type="text" value={messageArea} maxLength={400} placeholder="Message" onChange={e => setMessageArea(e.target.value)}/> <br/><br/><br/>

                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Contact;
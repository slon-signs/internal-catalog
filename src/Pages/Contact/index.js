import React, {useState, useContext} from "react";
import './style.css';
import {toast} from 'react-toastify';
import { AuthContext } from "../../Contexts/auth";
import { ItemContext } from "../../Contexts/itemIdContext";
import logoSquare from '../../img/slon-small.png';

import Header from '../../Static/Header';

function ContactPriv(){

    const [subject, setSubject] = useState('');
    const [messageArea, setMessageArea] = useState('');

    const {user} = useContext(AuthContext);
    const {handleSubmitMessage} = useContext(ItemContext);

    async function sendMessage(){
        
        if(subject === '' || messageArea === ''){
            toast.warn('All fields must be filled out!');
            return;
        }

        await handleSubmitMessage(user.username, user.email, subject, messageArea);

        setSubject('');
        setMessageArea('');
    }

    return(
        <div className="contactMainContainer">
            <Header/>

            <div className="contactContainer">
                <div className="contactHeadercontainer">
                    <div>
                        <img
                            src={logoSquare}
                            alt="App Logo"
                        />
                        <h3> Contact us</h3>
                    </div>
                </div>
                <hr />
                <div className="contactInputContainer">
                    <input className="inputDisabled" type="text" disabled={true} maxLength={40} placeholder={user.username} /> <br/>

                    <input className="inputDisabled" type="email" disabled={true} maxLength={30} placeholder={user.email}/> <br/>

                    <input type="text" value={subject} maxLength={40}placeholder="subject" onChange={ e => setSubject(e.target.value)}/> <br/><br/>

                    <textarea type="text" value={messageArea} maxLength={400} placeholder="Message" onChange={e => setMessageArea(e.target.value)}/> <br/><br/><br/>

                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default ContactPriv;
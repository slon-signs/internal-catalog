import {useContext} from 'react';

import { Navigate } from 'react-router-dom';
import {AuthContext} from '../Contexts/auth';

export default function Private({children}){
    
    const {signed, loading, user} = useContext(AuthContext);

    if(loading){
        return(
           <div></div> 
        )
    }

    if(!signed || (user && !user.emailVerified)){
        return <Navigate to="/"/> //if you don´t get acess stay at signIn page
    }
    //else it´s ok you can acess 
    return children;
}
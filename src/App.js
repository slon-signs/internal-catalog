import React from 'react';
import {ToastContainer} from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

import RoutesApp from './Routes/index.js';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <BrowserRouter basename="/internal-catalog">

        <ToastContainer autoClose={2500}/>
        <RoutesApp/>

    </BrowserRouter>
  );
}

export default App;  

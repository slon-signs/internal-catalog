import React, { useContext } from 'react';
// import {Link} from 'react-router-dom';

import './style.css';

// import { LogOut } from 'react-feather';
// import { Home } from 'react-feather';
// import { Clipboard } from 'react-feather';
// import { Settings } from 'react-feather';
// import { Layers } from 'react-feather';
// import { Users } from 'react-feather';
// import { Inbox } from 'react-feather';

import logoCircle from '../../img/Mich-small-logo.png';

function Header() {

  // const {logout, user} = useContext(AuthContext);

  // async function handleLogoutUser(){
  //   await logout();
  // }

  return (
    <header className="header">

      <div className="headerLeftSide">
          <img
              src={logoCircle}
              alt="App Logo"
              className="headerLogoCircle"
          />

          {/* <div>
            <Link to={"/home"}>
              <button className="buttonForIcons">
                <Home className="headerIcons marginleft"/>
                <h6 className="marginleft headerH6">Home</h6>
              </button>
            </Link>
          </div> */}
          
          {/* <div>
            <Link>
              <button className="buttonForIcons">
                <Inbox className="headerIcons marginleft" style={{opacity:0.3}}/>
                <h6 className="marginleft headerH6" style={{opacity:0.3}}>Quotes</h6>
              </button>
            </Link>
          </div> */}
          
          {/* <div>
            <Link to={"/quotes"}>
              <button className="buttonForIcons">
                <Inbox className="headerIcons marginleft"/>
                <h6 className="marginleft headerH6">Quotes</h6>
              </button>
            </Link>
          </div>

          <div>
            <Link to={"/customers"}>
              <button className="buttonForIcons">
                <Users className="headerIcons marginleft"/>
                <h6 className="marginleft headerH6">Customers</h6>
              </button>
            </Link>
          </div>

          <div>
            <Link to={"/products"}>
              <button className="buttonForIcons">
                <Clipboard className="headerIcons marginleft"/>
                <h6 className="marginleft headerH6">Products</h6>
              </button>
            </Link>
          </div>

          <div>
            <Link to={"/materials"}>
              <button className="buttonForIcons">
                <Layers className="headerIcons marginleft"/>
                <h6 className="marginleft headerH6">Materials</h6>
              </button>
            </Link>
          </div> */}

          {/* <div>
            <Link to={"/profile"}>
              <button className="buttonForIcons">
                <Settings className="headerIcons marginleft"/>
                <h6 className="marginleft headerH6">Profile</h6>
              </button>
            </Link>
          </div> */}

      </div>

      {/* <div className="headerRightSide"> */}

        {/* <p className='marginRight'>{user.email}</p>  */}
        {/* <div>
            <LogOut className="headerIcons" onClick={handleLogoutUser}/>
            <h6>Logout</h6>
        </div> */}
        
      {/* </div> */}

    </header>
  );
}

export default Header;

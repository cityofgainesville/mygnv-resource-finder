import React, { useState, useEffect }  from 'reactn';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import homeIcon from '../../images/myGNVrf.png';
import paths from '../../RouterPaths';
import './NavBar.scss';
import Title from './Title';
import RedirectButton from './RedirectButton';

// Navbar, links to home and admin page

const NavBar = (props) => {
  const [visible, setVisible] = useState(false);

  const handleEntailmentRequest = (e) => {
		e.preventDefault();
		setVisible(!visible);
		console.log(visible);
	
  };

  return (
    <React.Fragment>
    <div className='black-100-bg nav-container' >
        <Navbar collapseOnSelect sticky='top' expand='sm' variant='light'>
          <Navbar.Brand>

            <a href='/' class='nav-home-brand'>

            <img
              src={homeIcon}
              height='30'
              className='d-inline-block align-top'
            ></img>
            <span className='white-0 title' >myGNV Resource Directory</span>

            </a>

          </Navbar.Brand>
          <RedirectButton className='mobile-nav-buttons' path={paths.menuPath}><i class="fal fa-home-lg-alt nav-i" style={{color: 'white', }}></i></RedirectButton>
          {/*<Button className='mobile-nav-buttons' onClick = {(e)=>handleEntailmentRequest(e)}  style={{color: 'white', display: !visible ? '' : 'none'}}> <i class="fal fa-bars nav-i" ></i></Button>
          <Button className='mobile-nav-buttons'  onClick = {(e)=>handleEntailmentRequest(e)} style={{color: 'white', display: visible ? '' : 'none'}}> <i class="fal fa-times nav-i"  ></i><i class="fal fa-bars" style={{display: visible ? '' : 'none'}}></i></Button>*/}
          {/*<Navbar.Toggle onClick = {(e)=>handleEntailmentRequest(e)} aria-controls='mobile-menu-nav' style={{color: 'white', display: visible ? '' : 'none'}}> <i class="fal fa-bars nav-i" ></i></Navbar.Toggle>
          <Navbar.Toggle onClick = {(e)=>handleEntailmentRequest(e)} aria-controls='mobile-menu-nav'  style={{color: 'white', display: !visible ? '' : 'none'}}> <i class="fal fa-times nav-i"  ></i><i class="fal fa-bars" style={{display: visible ? '' : 'none'}}></i></Navbar.Toggle>
          <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav className='mr-auto'>
              
              <Nav.Link className='link-container'>
                  <NavLink
                    to={paths.mainPath}
                    className='nav-link'
                    activeClassName='navbar-active active'
                  >
                    Home
                  </NavLink>
                </Nav.Link>
               <Nav.Link className='link-container'>
                  <NavLink
                    to={paths.adminPath}
                    className='nav-link'
                    activeClassName='navbar-active active'
                  >
                    Admin
                  </NavLink>
  </Nav.Link>
              </Nav>
          </Navbar.Collapse>*/}
        </Navbar>
        <div id='feedback'>Help us improve the myGNV Resource Directory by giving us <a href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_74157YeIb6ttlYx' target='_blank' id='feedback-link'>feedback</a>. Do you have a resource to add? <a href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_bNMcXknvBcVfxoV' target='_blank' id='feedback-link'>Let us know.</a> </div>
    </div>
        {/*<div id='mobile-menu' style={{display: visible ? '' : 'none'}}><Title/></div>*/}
    </React.Fragment>
  );
};

export default NavBar;

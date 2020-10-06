import React, { useState, useEffect }  from 'reactn';
import { Navbar, Nav, Container, Button, Modal } from 'react-bootstrap';
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
    <div className='nav-container' >
        <Navbar collapseOnSelect sticky='top' expand='sm' variant='light'>
          <div className='mobile-top-nav-con'>
          <Navbar.Brand>

            <a href='/' class='nav-home-brand'>

            <img
              src={homeIcon}
              height='30'
              className='d-inline-block align-top'
            ></img>
            <span className='white-0 title' >myGNV Resource Finder</span>

            </a>

          </Navbar.Brand>
          {/*<RedirectButton className='mobile-nav-buttons' path={paths.menuPath} style={{ display: visible ? '' : 'none'}}><i class="fal fa-bars nav-i" style={{color: 'white', }}></i></RedirectButton>
          <RedirectButton className='mobile-nav-buttons' path={window.history.back()} style={{display: !visible ? '' : 'none'}}><i class="fal fa-times nav-i" style={{color: 'white', }}></i></RedirectButton>*/}
          {/*<Button className='mobile-nav-buttons' onClick = {(e)=>handleEntailmentRequest(e)}  style={{color: 'white', display: !visible ? '' : 'none'}}> <i class="fal fa-bars nav-i" ></i></Button>
          <Button className='mobile-nav-buttons'  onClick = {(e)=>handleEntailmentRequest(e)} style={{color: 'white', display: visible ? '' : 'none'}}> <i class="fal fa-times nav-i"  ></i><i class="fal fa-bars" style={{display: visible ? '' : 'none'}}></i></Button>*/}
          <Navbar.Toggle className='ipad' onClick = {(e)=>handleEntailmentRequest(e)} aria-controls='mobile-menu-nav' > <div style={{color: 'white', display: !visible  ? '' : 'none'}}><i class="fal fa-bars nav-i" ></i></div><div style={{color: 'white', display: visible  ? '' : 'none'}}><i class="fal fa-times nav-i"   ></i></div></Navbar.Toggle>
          </div>
          {/*<Navbar.Toggle className='ipad' onClick = {(e)=>handleEntailmentRequest(e)} aria-controls='mobile-menu-nav' > </Navbar.Toggle>*/}
          <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav className='mr-auto'>
              
              <Nav.Link className='link-container'>
                  <NavLink
                    exact to={paths.mainPath}
                    className='nav-link'
                    activeClassName='navbar-active active'
                  >
                    Home
                  </NavLink>
                </Nav.Link>
                <Nav.Link className='link-container'>
                  <NavLink
                    to={`${paths.providerPath}/?name=&zip=&age=&gender=&main=&sub=`}
                    className='nav-link'
                    activeClassName='navbar-active active'
                  >
                    Providers
                  </NavLink>
                </Nav.Link>
                <Nav.Link className='link-container'>
                  <NavLink
                    to={paths.hotlinesPath}
                    className='nav-link'
                    activeClassName='navbar-active active'
                  >
                    Hotlines
                  </NavLink>
                </Nav.Link>
                <Nav.Link className='link-container'>
                  <NavLink
                    to={paths.searchPath}
                    className='nav-link'
                    activeClassName='navbar-active active'
                  >
                    <div class='search-nav-con '>
                     <i class="far fa-search"></i>
                     <span class='search-nav'>  Search</span>
                     </div>
                  </NavLink>
                </Nav.Link>
              <div className ='mobile-feedback'>
              <div >
              Spot something wrong or want to add a new resource? Let us know!
              </div>
              <Button className='title-links top-link' variant="link" href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_74157YeIb6ttlYx' target='_blank'>Feedback</Button>
              <Button className='title-links'  variant="link" href='https://cityofgainesville.iad1.qualtrics.com/jfe/form/SV_bNMcXknvBcVfxoV' target='_blank'>Add a Resource</Button>
              </div>
               {/*<Nav.Link className='link-container'>
                  <NavLink
                    to={paths.adminPath}
                    className='nav-link'
                    activeClassName='navbar-active active'
                  >
                    Admin
                  </NavLink>
        </Nav.Link>*/}
              </Nav>
          </Navbar.Collapse>
        </Navbar>
       
    </div>
       {/* <div id='mobile-menu' style={{display: visible ? '' : 'none'}}><Modal id='modal-menu' show={visible}><Title/></Modal></div>*/}
    </React.Fragment>
  );
};

export default NavBar;

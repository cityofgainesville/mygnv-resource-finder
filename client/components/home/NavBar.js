import React from 'reactn';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import homeIcon from '../../images/myGNVrf.png';
import paths from '../../RouterPaths';
import './NavBar.scss';

// Navbar, links to home and admin page

const NavBar = (props) => {
  return (
    <div className='black-100-bg nav-container' >
        <Navbar collapseOnSelect sticky='top' expand='sm' variant='light'>
          <Navbar.Brand>
            <img
              src={homeIcon}
              height='30'
              className='d-inline-block align-top'
            ></img>
            <span className='white-0'><strong>myGNV Resource Directory</strong></span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
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
          </Navbar.Collapse>
        </Navbar>
    </div>
  );
};

export default NavBar;

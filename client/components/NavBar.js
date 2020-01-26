import React from 'reactn';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import homeIcon from '../images/myGNV_img_black.png';
import paths from '../RouterPaths';
import './NavBar.scss';

// Navbar, links to home and admin page

const NavBar = (props) => {
  return (
    <div className='mint-cool-30v-bg' style={{ width: '100%' }}>
      <Container>
        <Navbar collapseOnSelect sticky='top' expand='sm' variant='light'>
          <Navbar.Brand>
            <img
              src={homeIcon}
              height='30'
              className='d-inline-block align-top'
              style={{ paddingRight: '0.25em' }}
            ></img>
            <span className='black-100'>my</span>
            <span className='white-0'>GNV </span>
            <span className='black-100'>Resource Directory</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id='responsive-navbar-nav'>
            <Nav className='mr-auto'>
              <Nav.Link style={{ margin: '0 0', padding: '0 0' }}>
                <NavLink
                  exact
                  to={paths.mainPath}
                  className='nav-link'
                  activeClassName='navbar-active active'
                >
                  Home
                </NavLink>
              </Nav.Link>
              <Nav.Link style={{ margin: '0 0', padding: '0 0' }}>
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
      </Container>
    </div>
  );
};

export default NavBar;

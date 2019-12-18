import React from 'reactn';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './NavBar.scss';
import homeIcon from '../images/myGNV_img_black.png';
import paths from '../RouterPaths';

// Bootstrap Navbar, links to home and admin page

class NavBar extends React.Component {
  render() {
    return (
      <div className='mint-cool-30v-bg' style={{ width: '100%' }}>
        <Container>
          <Navbar
            collapseOnSelect
            expand='sm'
            variant='dark'
            style={{ margin: 'auto' }}
          >
            <Navbar.Brand>
              <img
                src={homeIcon}
                height='30'
                className='d-inline-block align-top'
                style={{ paddingRight: '0.25em' }}
              ></img>
              <span className='black-100'>my</span>GNV{' '}
              <span className='black-100'>Resource Directory</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls='responsive-navbar-nav' />
            <Navbar.Collapse id='responsive-navbar-nav'>
              <Nav className='mr-auto'>
                <NavLink
                  exact
                  to={paths.mainPath}
                  className='navbar-link'
                  activeClassName='navbar-active'
                >
                  Home
                </NavLink>
                <NavLink
                  exact
                  to={paths.adminPath}
                  className='navbar-link'
                  activeClassName='navbar-active'
                >
                  Admin
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </div>
    );
  }
}

export default NavBar;

import React from 'reactn';
import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import RedirectButton from './RedirectButton';
import PropTypes from 'prop-types';

import Login from './auth/Login';
import Register from './auth/Register';
import CategoryAdmin from './admin/CategoryAdmin';

import paths from '../RouterPaths';

// Either prompts user to login or displays logout button
// And buttons for the different admin portal sections

class AdminPortal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const renderLoggedIn = (
      <Container
        style={{
          margins: 'auto auto',
          maxWidth: '60em',
        }}
      >
        <Row className='justify-content-md-center' style={{ margin: 'auto' }}>
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <RedirectButton exact path={paths.categoriesAdminPath}>
              Add/Remove/Edit Categories
            </RedirectButton>
          </Col>
          <Col md='auto' style={{ textAlign: 'center' }}>
            <RedirectButton exact path={paths.providersAdminPath}>
              Add Providers
            </RedirectButton>
          </Col>
          <Col md='auto' style={{ textAlign: 'center' }}>
            <RedirectButton exact path={paths.usersAdminPath}>
              Add Users
            </RedirectButton>
          </Col>
        </Row>
      </Container>
    );

    return (
      <React.Fragment>
        <Login />
        {this.global.isAuthenticated ? renderLoggedIn : null}
        <Switch>
          <Route
            exact
            path={paths.adminPath}
            render={() => {
              <React.Fragment>{renderLoggedIn}</React.Fragment>;
            }}
          />
          <Route
            exact
            path={paths.categoriesAdminPath}
            render={() => <CategoryAdmin />}
          />
          <Route
            exact
            path={paths.usersAdminPath}
            render={() => (
              <Row
                className='justify-content-md-center'
                style={{ margin: 'auto', marginBottom: '1em' }}
              >
                <Register />
              </Row>
            )}
          />
        </Switch>
      </React.Fragment>
    );
  }
}

AdminPortal.propTypes = {};

export default AdminPortal;

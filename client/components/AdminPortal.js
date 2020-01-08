import React, { useGlobal } from 'reactn';
import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import RedirectButton from './RedirectButton';

import Login from './auth/Login';
import UserRegister from './admin/user/UserRegister';
import CategoryAdmin from './admin/category';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import paths from '../RouterPaths';

// Either prompts user to login or displays logout button
// And buttons for the different admin portal sections

const AdminPortal = (props) => {
  const [currentUser] = useGlobal('currentUser');

  const buttonColorIfMatchPath = (path) => {
    console.log(props.history.location.pathname);
    console.log(path);
    if (props.history.location.pathname == path) return 'primary';
    else return 'outline-primary';
  };

  console.log(props.history);

  const renderLoggedIn = (
    <Container
      style={{
        margins: 'auto auto',
        maxWidth: '60em',
      }}
    >
      <Row className='justify-content-md-center' style={{ margin: 'auto' }}>
        <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <RedirectButton
            exact
            path={paths.categoriesAdminPath}
            variant={buttonColorIfMatchPath(paths.categoriesAdminPath)}
          >
            Add/Remove/Edit Categories
          </RedirectButton>
        </Col>
        <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <RedirectButton
            exact
            path={paths.providersAdminPath}
            variant={buttonColorIfMatchPath(paths.providersAdminPath)}
          >
            Add Providers
          </RedirectButton>
        </Col>
        <Col md='auto' style={{ textAlign: 'center' }}>
          <RedirectButton
            exact
            path={paths.usersAdminPath}
            variant={buttonColorIfMatchPath(paths.usersAdminPath)}
          >
            Add Users
          </RedirectButton>
        </Col>
      </Row>
    </Container>
  );

  return (
    <React.Fragment>
      <Login />
      {currentUser ? renderLoggedIn : null}
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
              <UserRegister />
            </Row>
          )}
        />
      </Switch>
    </React.Fragment>
  );
};

AdminPortal.propTypes = { history: PropTypes.instanceOf(Object).isRequired };

export default withRouter(AdminPortal);

import React, { useGlobal } from 'reactn';
import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import RedirectButton from '../RedirectButton';

import Login from '../auth/Login';
import UserAdmin from './user';
import CategoryAdmin from './category';
import ProviderAdmin from './provider';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import paths from '../../RouterPaths';

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

  const renderCategoriesButton = () => {
    if (currentUser && currentUser.role === 'Owner')
      return (
        <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <RedirectButton
            exact
            path={paths.categoriesAdminPath}
            variant={buttonColorIfMatchPath(paths.categoriesAdminPath)}
          >
            Edit Categories
          </RedirectButton>
        </Col>
      );
    else return null;
  };

  const renderUsersButton = () => {
    if (currentUser)
      return (
        <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <RedirectButton
            exact
            path={paths.usersAdminPath}
            variant={buttonColorIfMatchPath(paths.usersAdminPath)}
          >
            Edit Users
          </RedirectButton>
        </Col>
      );
    else return null;
  };

  const renderLoggedIn = (
    <Container
      style={{
        margins: 'auto auto',
        maxWidth: '60em',
      }}
    >
      <Row className='justify-content-md-center' style={{ margin: 'auto' }}>
        {renderCategoriesButton()}
        <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <RedirectButton
            exact
            path={paths.providersAdminPath}
            variant={buttonColorIfMatchPath(paths.providersAdminPath)}
          >
            Edit Providers
          </RedirectButton>
        </Col>
        {renderUsersButton()}
      </Row>
    </Container>
  );

  return (
    <React.Fragment>
      <Login />
      {currentUser ? renderLoggedIn : null}
      <Switch>
        {/* <Route
          exact
          path={paths.adminPath}
          render={() => {
            <React.Fragment>{renderLoggedIn}</React.Fragment>;
          }}
        /> */}
        <Route
          exact
          path={paths.providersAdminPath}
          render={() => <ProviderAdmin />}
        ></Route>
        <Route
          exact
          path={paths.categoriesAdminPath}
          render={() => <CategoryAdmin />}
        />
        <Route exact path={paths.usersAdminPath} render={() => <UserAdmin />} />
      </Switch>
    </React.Fragment>
  );
};

AdminPortal.propTypes = { history: PropTypes.instanceOf(Object).isRequired };

export default withRouter(AdminPortal);

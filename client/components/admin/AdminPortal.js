import React, { useGlobal, useState, useEffect } from 'reactn';
import { Route, Switch } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import RedirectButton from '../RedirectButton';
import Login from '../auth/Login';
import UserAdmin from './user';
import CategoryAdmin from './category';
import ProviderAdmin from './provider';
import paths from '../../RouterPaths';

// Either prompts user to login or displays logout button
// And buttons for the different admin portal sections

const AdminPortal = (props) => {
  const [currentUser] = useGlobal('currentUser');

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [providersAllowedToModify, setProvidersAllowedToModify] = useState([]);

  const getData = () => {
    axios
      .get('/api/categories/list')
      .then((res) => {
        setCategories(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get('/api/providers/list')
      .then((res) => {
        setProviders(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get('/api/users/list')
      .then((res) => {
        setUsers(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRefreshData = () => {
    getData();
  };

  const getProvidersAllowedToModify = () => {
    if (!currentUser || !categories || !providers) return [];
    if (currentUser.role === 'Owner') {
      return providers;
    } else {
      const allowedProviders = [];
      const categoryMap = new Map(
        categories.map((category) => [category._id, category])
      );
      const providerMap = new Map(
        providers.map((provider) => [provider._id, provider])
      );
      if (currentUser.role === 'Editor') {
        currentUser.provider_can_edit.forEach((id) => {
          if (!providerMap.has(id)) return;
          allowedProviders.push(providerMap.get(id));
        });

        // for each category in cat_can_edit_provider_in, get all providers and stick in array
        currentUser.cat_can_edit_provider_in.forEach((id) => {
          if (!categoryMap.has(id)) return;
          allowedProviders.push(
            ...categoryMap
              .get(id)
              .providers.filter((id) => providerMap.has(id))
              .map((id) => {
                return providerMap.get(id);
              })
          );
        });
      }
      if (
        currentUser.can_edit_assigned_provider &&
        currentUser.assigned_provider &&
        currentUser.assigned_provider !== '' &&
        providerMap.has(currentUser.assigned_provider)
      )
        allowedProviders.push(providerMap.get(currentUser.assigned_provider));

      const removeDuplicates = (array) => {
        return array.filter((a, b) => array.indexOf(a) === b);
      };

      return removeDuplicates(allowedProviders);
    }
  };

  useEffect(() => {
    getData();
  }, [currentUser]);

  useEffect(() => {
    setProvidersAllowedToModify(getProvidersAllowedToModify());
  }, [currentUser, categories, providers]);

  const buttonColorIfMatchPath = (path) => {
    if (props.history.location.pathname == path) return 'primary';
    else return 'outline-primary';
  };

  const renderLoggedIn = () => (
    <Container
      style={{
        margins: 'auto auto',
        maxWidth: '60em',
      }}
    >
      <Row className='justify-content-md-center' style={{ margin: 'auto' }}>
        {currentUser.role === 'Owner' ? (
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <RedirectButton
              exact
              path={paths.categoriesAdminPath}
              variant={buttonColorIfMatchPath(paths.categoriesAdminPath)}
            >
              Edit Categories
            </RedirectButton>
          </Col>
        ) : null}
        <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <RedirectButton
            exact
            path={paths.providersAdminPath}
            variant={buttonColorIfMatchPath(paths.providersAdminPath)}
          >
            Edit Providers
          </RedirectButton>
        </Col>
        <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <RedirectButton
            exact
            path={paths.usersAdminPath}
            variant={buttonColorIfMatchPath(paths.usersAdminPath)}
          >
            Edit Users
          </RedirectButton>
        </Col>
      </Row>
    </Container>
  );

  return (
    <>
      <Login
        categories={categories}
        providers={providers}
        refreshDataCallback={handleRefreshData}
      />
      {currentUser ? (
        <>
          {renderLoggedIn()}
          <Switch>
            {currentUser.role === 'Owner' ? (
              <Route
                exact
                path={paths.categoriesAdminPath}
                render={() => (
                  <CategoryAdmin
                    categories={categories}
                    providers={providers}
                    users={users}
                    refreshDataCallback={handleRefreshData}
                  />
                )}
              />
            ) : null}
            <Route
              exact
              path={paths.providersAdminPath}
              render={() => (
                <ProviderAdmin
                  providersAllowedToModify={providersAllowedToModify}
                  refreshDataCallback={handleRefreshData}
                />
              )}
            />
            <Route
              exact
              path={paths.usersAdminPath}
              render={() => (
                <UserAdmin
                  categories={categories}
                  providers={providers}
                  users={users}
                  refreshDataCallback={handleRefreshData}
                />
              )}
            />
          </Switch>
        </>
      ) : null}
    </>
  );
};

AdminPortal.propTypes = { history: PropTypes.instanceOf(Object).isRequired };

export default withRouter(AdminPortal);

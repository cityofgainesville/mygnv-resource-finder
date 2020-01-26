import { hot } from 'react-hot-loader/root';
import React from 'reactn';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import paths from './RouterPaths';

import Category from './components/category';

import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import Title from './components/Title';
import AdminPortal from './components/admin';
import IndivProvider from './components/IndivProvider';
import Search from './components/Search';

import AuthState from './components/auth/AuthState';

const App = (props) => {
  // Handles routing admin portal, main page, search, category & provider list
  // and individual provider
  return (
    <React.Fragment>
      <AuthState />
      <NavBar />
      <Title />
      <Switch>
        <Route path={paths.adminPath} component={AdminPortal} />
        <Route exact path={paths.mainPath} component={MainPage} />
        <Route exact path={paths.searchPath} component={Search} />
        <Route
          exact
          path={paths.providerPath + '/:id'}
          render={(props) => <IndivProvider id={props.match.params.id} />}
        />
        <Route
          exact
          path={paths.categoryPath + '/:id?'}
          render={(props) => <Category id={props.match.params.id} />}
        />
      </Switch>
    </React.Fragment>
  );
};

App.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
};

export default hot(App);

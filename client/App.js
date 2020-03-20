import { hot } from 'react-hot-loader/root';
import React from 'reactn';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import paths from './RouterPaths';

import Category from './components/home/category';

import NavBar from './components/home/NavBar';
import MainPage from './components/home/MainPage';
import Title from './components/home/Title';
import AdminPortal from './components/admin';
import IndivProvider from './components/home/IndivProvider';
import Search from './components/home/Search';
import Hotlines from './components/home/Hotlines';
import Safeplaces from './components/home/Safeplaces';


import AuthState from './components/auth/AuthState';

const App = (props) => {
  // Handles routing admin portal, main page, search, category & provider list
  // and individual provider
  return (
    <React.Fragment>
      <AuthState />
      <NavBar />
      <Title/>
      <Switch>
        <Route path={paths.adminPath} component={AdminPortal} />
        <Route exact path={paths.mainPath} component={MainPage} />
        <Route exact path={paths.searchPath} component={Search} />
        <Route exact path={paths.safeplacesPath} component={Safeplaces} />
        <Route exact path={paths.hotlinesPath} component={Hotlines} />
        <Route exact path={paths.defaultPath} component={MainPage}/>
        /*<Route exact path={paths.hotlinesPath + '/:id'} 
          render={(props) => <Hotlines id={props.match.params.id}
        />}/>
        <Route 
          exact 
          path={paths.safeplacesPath + '/:id'}  
          render={(props) => <Safeplaces id={props.match.params.id}
        />}/>*/
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

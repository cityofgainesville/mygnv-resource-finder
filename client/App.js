import ReactGA from 'react-ga';
ReactGA.initialize('UA-163304507-1', { standardImplementation: true });
//ReactGA.pageview(window.location.pathname + window.location.search);
import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'reactn';
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

//import Covid from './components/home/Covid19';

import './index.scss';


import AuthState from './components/auth/AuthState';

const App = (props) => {
  // Handles routing admin portal, main page, search, category & provider list
  // and individual provider
  function initializeReactGA() {
    ReactGA.initialize('UA-163304507-1');
    ReactGA.pageview('/homepage');
}
  const [current, setCurrent] = useState("Search");
  return (
    <React.Fragment>
      <AuthState />
      <NavBar />
      
      <Switch>
        <Route path={paths.adminPath} component={AdminPortal} />
        <Route exact path={paths.mainPath} component={MainPage}></Route>
        <Route exact path={paths.searchPath} component={Search}><div className="noDisplay"><Title/></div><Search/></Route>
        <Route exact path={paths.safeplacesPath} component={Safeplaces}><div className="noDisplay"><Title/></div><Safeplaces/></Route>
        <Route exact path={paths.hotlinesPath} component={Hotlines}><div className="noDisplay"><Title/></div><Hotlines/></Route>

        {/*<Route exact path={paths.covidPath} component={Covid}><div className="noDisplay"><Title/></div><Covid/></Route>*/}
        <Route exact path={paths.defaultPath} component={MainPage}></Route>
        <Route exact path={paths.menuPath} component={Title}></Route>
        <Route
          exact
          path={paths.providerPath + '/:id'}
          render={(props) => <React.Fragment><div className="noDisplay"><Title/></div><IndivProvider id={props.match.params.id} /></React.Fragment>}
        />
        <Route
          exact
          path={paths.categoryPath + '/:id?'}
          render={(props) => <React.Fragment><div className="noDisplay"><Title/></div><Category id={props.match.params.id} /></React.Fragment>}
        />
      </Switch>
    </React.Fragment>
  );
};

App.propTypes = {
  match: PropTypes.instanceOf(Object).isRequired,
};

export default hot(App);

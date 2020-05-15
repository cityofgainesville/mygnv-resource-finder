import React from 'reactn';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-163355772-1');
ReactGA.pageview(window.location.pathname + window.location.search);
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Favicon from 'react-favicon';
//import Icon from './favicon.ico';
import 'normalize.css';
import './custom.scss';
import './index.scss';
import App from './App';

// Normalize CSS and start React App

ReactDOM.render(
  <BrowserRouter>
  <Favicon url="https://raw.githubusercontent.com/cityofgainesville/mygnv-resource-finder/master/client/favicon.ico" />
    <App />
  </BrowserRouter>,
  document.querySelector('#root')
);

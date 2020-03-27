import React, { useGlobal } from 'reactn';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Login.scss';

import axios from 'axios';

// Logout button that communicates with backend to end session
// Will redirect to app home page

const AuthButton = (props) => {
  const [currentUser, setCurrentUser] = useGlobal('currentUser');

  const logout = () => {
    axios
      .post('/api/users/logout')
      .then((res) => {
        setCurrentUser(null);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    logout();
    props.history.push('/home');
  };

  return currentUser ? <Button variant='primary' className='login-menu-button' onClick={handleLogout}>Log Out</Button> : null;
};

AuthButton.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(AuthButton);
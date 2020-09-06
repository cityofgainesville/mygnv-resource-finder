import React, { useGlobal } from 'reactn';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Login.scss';
import axios from 'axios';
import paths from '../../RouterPaths';

// Logout button that communicates with backend to end session
// Will redirect to app home page

const AuthButton = (props) => {
  const [currentUser, setCurrentUser] = useGlobal('currentUser');
  const [token, setToken] = useGlobal('token');

  const logout = async () => {
    await axios.put(
      '/api/auth/revoke-token',
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    setCurrentUser(null);
    setToken(null);
  };

  const handleLogout = async () => {
    await logout();
    props.history.push(paths.adminPath);
  };

  return currentUser ? (
    <Button
      variant='primary'
      className='login-menu-button'
      onClick={handleLogout}
    >
      Log Out
    </Button>
  ) : null;
};

AuthButton.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(AuthButton);

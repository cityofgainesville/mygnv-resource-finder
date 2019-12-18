import React from 'reactn';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import axios from 'axios';

// Logout button that communicates with backend to end session
// Will redirect to app home page

class AuthButton extends React.Component {
  constructor(props) {
    super(props);
  }

  logout = () => {
    axios
      .post('/api/user/logout')
      .then((res) => {
        this.setGlobal({ isAuthenticated: false });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleLogout = () => {
    this.logout();
    this.props.history.push('/');
  };

  render() {
    return this.global.isAuthenticated ? (
      <Button onClick={this.handleLogout}>Log Out</Button>
    ) : null;
  }
}

AuthButton.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(AuthButton);

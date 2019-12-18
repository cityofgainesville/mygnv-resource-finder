import React from 'reactn';
import { Button, Form, Modal, Alert, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import LogoutButton from './LogoutButton';

// Modal style login component
// Communicates with backend, see backend comments for api docs

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      invalidAttempt: false,
      modalIsDisplayed: false,
    };
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  openModal = () => {
    this.setState({
      modalIsDisplayed: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalIsDisplayed: false,
      invalidAttempt: false,
    });
  };

  login = (event) => {
    event.preventDefault();
    axios
      .post('/api/user/login', {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        this.setGlobal({
          isAuthenticated: res.data.success,
          userEmail: res.data.email,
        });
        if (res.data.success) {
          this.closeModal();
        } else this.setState({ invalidAttempt: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const alreadyLoggedIn = (
      <React.Fragment>
        <span style={{ marginRight: '1em' }}>
          Welcome {this.global.userEmail}!
        </span>
        <LogoutButton />
      </React.Fragment>
    );

    const needsLogin = (
      <React.Fragment>
        <span style={{ marginRight: '1em' }}>
          Welcome, please login to access the admin portal.
        </span>
        <Button variant='primary' onClick={this.openModal}>
          Login
        </Button>
        <Modal show={this.state.modalIsDisplayed} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.invalidAttempt ? (
              <Alert
                variant='danger'
                style={{
                  marginTop: '1em',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Invalid email or password. Please try again.
              </Alert>
            ) : null}
            <Form>
              <Form.Group controlId='formBasicEmail'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  type='Email'
                  placeholder='Email'
                />
              </Form.Group>
              <Form.Group controlId='formBasicPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  type='password'
                  placeholder='Password'
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.closeModal}>
              Close
            </Button>
            <Button onClick={this.login} variant='primary' type='submit'>
              Log In
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );

    return (
      <Row
        className='justify-content-md-center'
        style={{ margin: 'auto', marginBottom: '1em' }}
      >
        {this.global.isAuthenticated ? alreadyLoggedIn : needsLogin}
      </Row>
    );
  }
}

Login.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
};

export default Login;

import React, { useState, useGlobal } from 'reactn';
import { Button, Form, Modal, Alert, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import LogoutButton from './LogoutButton';

// Modal style login component
// Communicates with backend, see backend comments for api docs

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidAttempt, setInvalidAttempt] = useState(false);
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);

  const [currentUser, setCurrentUser] = useGlobal('currentUser');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const openModal = () => {
    setModalIsDisplayed(true);
  };

  const closeModal = () => {
    setModalIsDisplayed(false);
  };

  const doLogin = (event) => {
    event.preventDefault();
    axios
      .post('/api/users/login', {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.success) {
          setCurrentUser(res.data.user);
          closeModal();
        } else setInvalidAttempt(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const alreadyLoggedIn = () => {
    if (!currentUser) return null;
    else
      return (
        <React.Fragment>
          <span style={{ marginRight: '1em' }}>
            Welcome {currentUser.email}!
          </span>
          <LogoutButton />
        </React.Fragment>
      );
  };

  const renderLoginButton = () => {
    if (success)
      return (
        <Button onClick={doLogin} variant='success' type='submit'>
          Success
        </Button>
      );
    else if (hadError) {
      return (
        <Button onClick={doLogin} variant='warning' type='submit'>
          Try Again
        </Button>
      );
    } else
      return (
        <Button onClick={doLogin} variant='primary' type='submit'>
          Login
        </Button>
      );
  };

  const needsLogin = (
    <React.Fragment>
      <span style={{ marginRight: '1em' }}>
        Welcome, please login to access the admin portal.
      </span>
      <Button variant='primary' onClick={openModal}>
        Login
      </Button>
      <Modal show={modalIsDisplayed} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {invalidAttempt ? (
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
                value={email}
                onChange={handleEmailChange}
                type='Email'
                placeholder='Email'
              />
            </Form.Group>
            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={handlePasswordChange}
                type='password'
                placeholder='Password'
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            Close
          </Button>
          <Button onClick={doLogin} variant='primary' type='submit'>
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );

  return (
    <Row
      style={{
        margin: 'auto',
        marginBottom: '1em',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {currentUser ? alreadyLoggedIn() : needsLogin}
    </Row>
  );
};

Login.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
};

export default Login;

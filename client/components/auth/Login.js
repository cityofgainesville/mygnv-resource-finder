import React, { useState, useGlobal } from 'reactn';
import {
  Container,
  Button,
  Form,
  Modal,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import axios from 'axios';
import PropTypes from 'prop-types';

import LogoutButton from './LogoutButton';
import CurrentUserEdit from '../admin/user/CurrentUserEdit';

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
        <Row className='justify-content-md-center' style={{ margin: 'auto' }}>
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <span>{`Logged in as: ${currentUser.email}`}</span>
          </Col>
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <CurrentUserEdit
              categories={props.categories}
              providers={props.providers}
              refreshDataCallback={props.refreshDataCallback}
              buttonName='Edit Current User'
            />
          </Col>
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <LogoutButton />
          </Col>
        </Row>
      );
  };

  const needsLogin = (
    <Row className='justify-content-md-center' style={{ margin: 'auto' }}>
      <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
        <span>Welcome, please login to access the admin portal.</span>
      </Col>
      <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
        <Button variant='primary' onClick={openModal}>
          Login
        </Button>
      </Col>
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
    </Row>
  );

  return (
    <Container
      style={{
        margins: 'auto auto',
        maxWidth: '60em',
      }}
    >
      {currentUser ? alreadyLoggedIn() : needsLogin}
    </Container>
  );
};

Login.propTypes = {
  categories: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
  refreshDataCallback: PropTypes.func.isRequired,
};

export default Login;

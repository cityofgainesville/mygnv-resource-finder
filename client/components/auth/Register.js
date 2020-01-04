import React, { useState } from 'reactn';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

import axios from 'axios';

// Modal style register component
// Communicates with backend, see backend comments for api docs

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hadError, setHadError] = useState(false);
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const login = (event) => {
    event.preventDefault();
    axios
      .post('/api/user/register', {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.success) closeModal();
        else setHadError(true);
      })
      .catch((err) => {
        console.log(err);
        setHadError(true);
      });
  };

  const openModal = () => {
    setModalIsDisplayed(true);
  };

  const closeModal = () => {
    setModalIsDisplayed(false);
  };

  return (
    <React.Fragment>
      <Button variant='primary' onClick={openModal}>
        Register
      </Button>
      <Modal show={modalIsDisplayed} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {hadError ? (
            <Alert
              variant='danger'
              style={{
                marginTop: '1em',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              An error has occurred. Please try again.
            </Alert>
          ) : null}
          <Form>
            <Form.Group controlId='formBasicEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                onChange={handleEmailChange}
                type='email'
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
          <Button onClick={login} variant='primary' type='submit'>
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

Register.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
};

export default Register;

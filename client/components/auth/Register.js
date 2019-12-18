import React from 'reactn';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

import axios from 'axios';

// Modal style register component
// Communicates with backend, see backend comments for api docs

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      hadError: false,
      modalIsDisplayed: false,
    };
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  login = (event) => {
    event.preventDefault();
    axios
      .post('/api/user/register', {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        if (res.data.success) this.closeModal();
        else this.setState({ hadError: true });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ hadError: true });
      });
  };

  openModal = () => {
    this.setState({
      modalIsDisplayed: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalIsDisplayed: false,
      hadError: false,
    });
  };

  render() {
    return (
      <React.Fragment>
        <Button variant='primary' onClick={this.openModal}>
          Register
        </Button>
        <Modal show={this.state.modalIsDisplayed} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.hadError ? (
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
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  type='email'
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
              Register
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

Register.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
};

export default Register;

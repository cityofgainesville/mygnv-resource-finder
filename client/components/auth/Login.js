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

import homeIcon from '../../images/myGNVrf.png';
import './Login.scss';
import paths from '../../RouterPaths';
import RedirectButton from '../home/RedirectButton';

// Modal style login component
// Communicates with backend, see backend comments for api docs

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidAttempt, setInvalidAttempt] = useState(false);
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);

  const [currentUser, setCurrentUser] = useGlobal('currentUser');
  const [token, setToken] = useGlobal('token');

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

  const doLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put('/api/auth/login', {
        email: email,
        password: password,
      });
      setCurrentUser(response.data.user);
      setToken(response.data.access_token);
      closeModal();
    } catch (error) {
      setInvalidAttempt(true);
    }
  };
  const alreadyLoggedIn = () => {
    if (!currentUser) return null;
    else
      return (
        <Row
          className='justify-content-md-center'
          style={{ margin: 'auto', marginTop: '155px' }}
        >
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

  // NEW - IN DEVELOPMENT

  /* const alreadyLoggedIn = () => {
    
    if (!currentUser) return null;
    else
      return (
        <Container className ='admin-container'>
        <Row className='justify-content-md-left'>
          <Col md='auto' className='name'>
            <span><strong>{`${currentUser.first_name.toUpperCase()} ${currentUser.last_name.toUpperCase()}`}</strong></span>
          </Col>
        </Row>
        <Row className='justify-content-md-left'>
        {currentUser.role === 'Owner' ? (
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <RedirectButton
              exact
              path={paths.categoriesAdminPath}
              variant='light'
              className ='login-menu-button'
            >
              Categories
            </RedirectButton>
          </Col>
        ) : null}
        </Row>
        <Row className='justify-content-md-left'>
        <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
          <RedirectButton
            exact
            path={paths.providersAdminPath}
            variant='light'
            className ='login-menu-button'
          >
            Resources
          </RedirectButton>
        </Col>
        </Row>
        <Row className='justify-content-md-left'>
        {currentUser.role === 'Owner' ? (
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <RedirectButton
              exact
              path={paths.usersAdminPath}
              variant='light'
              className ='login-menu-button'
            >
              Users & Permissions
            </RedirectButton>
          </Col>
        ) : null}
      </Row>
          <Row className='justify-content-md-left'>
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <CurrentUserEdit
              categories={props.categories}
              providers={props.providers}
              refreshDataCallback={props.refreshDataCallback}
              buttonName='Settings'
            />
          </Col>
          </Row>
          <Row className='justify-content-md-left'>
          <Col md='auto' style={{ textAlign: 'center', paddingBottom: '1em' }}>
            <LogoutButton />
          </Col>
        </Row>
        </Container>
      );
      
  };*/

  const needsLogin = (
    <Container className='justify-content-md-center login-container'>
      <Row className='justify-content-md-center'>
        <img
          src={homeIcon}
          height='100'
          className='d-inline-block align-top login-img'
        ></img>
      </Row>
      <Row md='auto' className='justify-content-md-center login-title'>
        <span>
          <strong>myGNV Resource Directory</strong>
        </span>
      </Row>
      <Row md='auto' className='justify-content-md-center login-description'>
        <span>ADMIN PORTAL</span>
      </Row>
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
      <Form className='justify-content-md-center'>
        <Form.Group controlId='formBasicEmail' className='search-form-group'>
          <Form.Control
            value={email}
            onChange={handleEmailChange}
            type='Email'
            placeholder='Email'
            className='login'
          />
        </Form.Group>
        <Form.Group controlId='formBasicPassword' className='search-form-group'>
          <Form.Control
            value={password}
            onChange={handlePasswordChange}
            type='password'
            placeholder='Password'
            className='login'
          />
        </Form.Group>
      </Form>
      <Row
        md='auto'
        style={{ textAlign: 'center', paddingBottom: '1em' }}
        className='justify-content-md-center'
      >
        <Button onClick={doLogin} variant='outline-primary' type='submit'>
          LOGIN
        </Button>
      </Row>
    </Container>
  );

  return (
    <React.Fragment>
      {currentUser ? alreadyLoggedIn() : needsLogin}
    </React.Fragment>
  );
};

Login.propTypes = {
  categories: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
  refreshDataCallback: PropTypes.func.isRequired,
};

export default Login;

import React, { useState, useEffect } from 'reactn';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';

import axios from 'axios';

// Modal style register component
// Communicates with backend, see backend comments for api docs

const Register = (props) => {
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);

  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);

  const roleOptions = [
    { value: 'Provider', label: 'Provider' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Owner', label: 'Owner' },
  ];

  const boolOptions = [
    { value: true, label: 'True' },
    { value: false, label: 'False' },
  ];

  const [hadError, setHadError] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [role, setRole] = useState(roleOptions[0]);
  const [assignedProvider, setAssignedProvider] = useState('');
  const [canEditAssignedProvider, setCanEditAssignedProvider] = useState(false);
  const [providerCanEdit, setProviderCanEdit] = useState([]);
  const [catCanEditProviderIn, setCatCanEditProviderIn] = useState([]);

  const clearState = () => {
    setHadError(false);

    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');

    setRole(roleOptions[0]);
    setAssignedProvider('');
    setCanEditAssignedProvider(false);
    setProviderCanEdit([]);
    setCatCanEditProviderIn([]);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleRoleChange = (value) => {
    setRole(value);
  };
  const handleAssignedProviderChange = (value) => {
    setAssignedProvider(value);
  };
  const handleCanEditAssignedProviderChange = (value) => {
    setCanEditAssignedProvider(value);
  };
  const handleProviderCanEditChange = (value) => {
    setProviderCanEdit(value);
  };
  const handleCatCanEditProviderInChange = (value) => {
    setCatCanEditProviderIn(value);
  };

  // TODO- FINISH REGISTER
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
    clearState();
  };

  useEffect(() => {
    axios
      .get('/api/provider')
      .then((res) => {
        setProviders(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('/api/category', {})
      .then((res) => {
        setCategories(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const providerOptions = providers.map((provider) => {
    return { value: provider._id, label: provider.name };
  });

  const categoryOptions = categories.map((category) => {
    return { value: category._id, label: category.name };
  });

  const renderAssignedProvider = () => {
    if (role.value === 'Provider' || role.value === 'Editor') {
      return (
        <>
          <Form.Group>
            <Form.Label>Assigned Provider</Form.Label>
            <Select
              isSearchable
              isClearable={false}
              value={assignedProvider}
              onChange={handleAssignedProviderChange}
              options={providerOptions}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Can Edit Assigned Provider</Form.Label>
            <Select
              isSearchable
              isClearable={false}
              value={canEditAssignedProvider}
              onChange={handleCanEditAssignedProviderChange}
              options={boolOptions}
            />
          </Form.Group>
        </>
      );
    } else return null;
  };

  const renderEditorRole = () => {
    if (role.value === 'Editor') {
      return (
        <>
          <Form.Group>
            <Form.Label>Providers Can Edit</Form.Label>
            <Select
              isMulti
              isSearchable
              isClearable={false}
              value={providerCanEdit}
              onChange={handleProviderCanEditChange}
              options={providerOptions}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Can Edit Providers in Categories</Form.Label>
            <Select
              isMulti
              isSearchable
              isClearable={false}
              value={catCanEditProviderIn}
              onChange={handleCatCanEditProviderInChange}
              options={categoryOptions}
            />
          </Form.Group>
        </>
      );
    } else return null;
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

            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={firstName}
                onChange={handleFirstNameChange}
                type='first_name'
                placeholder='First Name'
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                value={lastName}
                onChange={handleLastNameChange}
                type='lastName'
                placeholder='Last Name'
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Select
                isSearchable
                isClearable={false}
                value={role}
                onChange={handleRoleChange}
                options={roleOptions}
              />
            </Form.Group>

            {renderAssignedProvider()}

            {renderEditorRole()}
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

import React, { useState, useEffect } from 'reactn';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';

import axios from 'axios';

// Modal style register component
// Communicates with backend, see backend comments for api docs

const UserRegister = (props) => {
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);

  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);

  const roleOptions = [
    { value: 'Provider', label: 'Provider' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Owner', label: 'Owner' },
  ];

  const boolOptions = [
    { value: false, label: 'False' },
    { value: true, label: 'True' },
  ];

  const [hadError, setHadError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [role, setRole] = useState(roleOptions[0]);
  const [assignedProvider, setAssignedProvider] = useState('');
  const [canEditAssignedProvider, setCanEditAssignedProvider] = useState(
    boolOptions[0]
  );
  const [providerCanEdit, setProviderCanEdit] = useState([]);
  const [catCanEditProviderIn, setCatCanEditProviderIn] = useState([]);

  const clearState = () => {
    setHadError(false);
    setSuccess(false);

    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');

    setRole(roleOptions[0]);
    setAssignedProvider('');
    setCanEditAssignedProvider(boolOptions[0]);
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
  const doRegister = async (event) => {
    event.preventDefault();

    const processMaybeArray = (maybeArray) => {
      if (!Array.isArray(maybeArray)) maybeArray = [maybeArray];
      return maybeArray.map((element) => element.value);
    };

    let postContent = {
      email: email,
      password: password, // this is NOT stored in plaintext, passport-local-mongoose hashes and salts it, and only then stores it
      first_name: firstName,
      last_name: lastName,
      role: role.value,
      assigned_provider: assignedProvider.value,
      can_edit_assigned_provider: canEditAssignedProvider.value,
      provider_can_edit: processMaybeArray(providerCanEdit),
      cat_can_edit_provider_in: processMaybeArray(catCanEditProviderIn),
    };

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    try {
      const res = await axios.post('/api/users/register', postContent);
      if (res.data.success) {
        setHadError(false);
        setSuccess(true);
        await sleep(500);
        closeModal();
      } else setHadError(true);
    } catch (err) {
      console.log(err);
      setHadError(true);
    }
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
      .get('/api/providers/list')
      .then((res) => {
        setProviders(Object.values(res.data));
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('/api/categories/list', {})
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

  const renderStatus = () => {
    if (success && !hadError) {
      return (
        <Alert
          variant='success'
          style={{
            marginTop: '1em',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Successfully registered user.
        </Alert>
      );
    } else if (hadError) {
      return (
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
      );
    } else return null;
  };

  const renderRegisterButton = () => {
    if (success)
      return (
        <Button onClick={doRegister} variant='success' type='submit'>
          Success
        </Button>
      );
    else if (hadError) {
      return (
        <Button onClick={doRegister} variant='warning' type='submit'>
          Try Again
        </Button>
      );
    } else
      return (
        <Button onClick={doRegister} variant='primary' type='submit'>
          Register
        </Button>
      );
  };

  return (
    <React.Fragment>
      <Button variant='primary' onClick={openModal} style={props.style}>
        Register
      </Button>
      <Modal show={modalIsDisplayed} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderStatus()}
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
          {renderRegisterButton()}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

UserRegister.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
};

export default UserRegister;

import React, { useState, useEffect } from 'reactn';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import Select from 'react-select';

// Modal style register component
// Communicates with backend, see backend comments for api docs

const UserEdit = (props) => {
  const getUserToEditFromProps = () => {
    return props.id
      ? props.users.filter((user) => {
          return user._id === props.id;
        })[0]
      : null;
  };

  const generateProviderOptions = () => {
    return props.providers.map((provider) => {
      return { value: provider._id, label: provider.name };
    });
  };

  const generateCategoryOptions = () => {
    return props.categories.map((category) => {
      return { value: category._id, label: category.name };
    });
  };

  const [userToEdit, setUserToEdit] = useState(getUserToEditFromProps());
  const [providerOptions, setProviderOptions] = useState(
    generateProviderOptions()
  );
  const [categoryOptions, setCategoryOptions] = useState(
    generateCategoryOptions()
  );
  const roleOptions = [
    { value: 'Provider', label: 'Provider' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Owner', label: 'Owner' },
  ];
  const boolOptions = [
    { value: false, label: 'False' },
    { value: true, label: 'True' },
  ];

  const [success, setSuccess] = useState(false);
  const [hadError, setHadError] = useState(false);
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [willSetNewPassword, setWillSetNewPassword] = useState(boolOptions[0]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);

  const [role, setRole] = useState(roleOptions[0]);
  const [assignedProvider, setAssignedProvider] = useState({});
  const [canEditAssignedProvider, setCanEditAssignedProvider] = useState(
    boolOptions[0]
  );
  const [providerCanEdit, setProviderCanEdit] = useState([]);
  const [catCanEditProviderIn, setCatCanEditProviderIn] = useState([]);

  /**
   * Reset success/fail flags
   */
  const resetFlags = () => {
    setHadError(false);
    setSuccess(false);
  };

  const clearState = () => {
    setEmail('');

    setWillSetNewPassword(boolOptions[0]);
    setPassword('');
    setConfirmPassword('');
    setValidConfirmPassword(false);

    setPassword('');
    setFirstName('');
    setLastName('');

    setRole(roleOptions[0]);
    setAssignedProvider('');
    setCanEditAssignedProvider(boolOptions[0]);
    setProviderCanEdit([]);
    setCatCanEditProviderIn([]);
  };

  const populateExistingUser = () => {
    setEmail(userToEdit.email);
    setFirstName(userToEdit.first_name);
    setLastName(userToEdit.last_name);
    setRole(
      roleOptions.filter((option) => {
        return option.value === userToEdit.role;
      })[0]
    );
    setAssignedProvider(
      userToEdit.assigned_provider
        ? providerOptions.filter((option) => {
            return option.value === userToEdit.assigned_provider;
          })[0]
        : {}
    );
    setCanEditAssignedProvider(
      userToEdit.can_edit_assigned_provider ? boolOptions[1] : boolOptions[0]
    );
    const providerIds = new Set(userToEdit.provider_can_edit);
    setProviderCanEdit(
      providerOptions.filter((option) => {
        return providerIds.has(option.value);
      })
    );
    const categoryIds = new Set(userToEdit.cat_can_edit_provider_in);
    setCatCanEditProviderIn(
      categoryOptions.filter((option) => {
        return categoryIds.has(option.value);
      })
    );
  };

  useEffect(() => {
    setUserToEdit(getUserToEditFromProps());
    setProviderOptions(generateProviderOptions());
    setCategoryOptions(generateCategoryOptions());
  }, [props]);

  useEffect(() => {
    if (props.id && userToEdit) {
      populateExistingUser();
    }
  }, [userToEdit, providerOptions, categoryOptions]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setValidConfirmPassword(
      event.target.value === confirmPassword && event.target.value !== ''
    );
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setValidConfirmPassword(
      password === event.target.value && event.target.value !== ''
    );
  };
  const handleWillSetNewPasswordChange = (value) => {
    setWillSetNewPassword(value);
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
  const doSubmit = async (event) => {
    event.preventDefault();

    const processMaybeArray = (maybeArray) => {
      if (maybeArray === null) return [];
      return Array.isArray(maybeArray)
        ? maybeArray.map((e) => e.value)
        : [maybeArray.value];
    };

    const postContent = {
      email: email,
      password: willSetNewPassword.value ? password : '', // this is NOT stored in plaintext, passport-local-mongoose hashes and salts it, and only then stores it
      first_name: firstName,
      last_name: lastName,
      role: role.value,
      assigned_provider: assignedProvider.value ? assignedProvider.value : '',
      can_edit_assigned_provider: canEditAssignedProvider.value,
      provider_can_edit: processMaybeArray(providerCanEdit),
      cat_can_edit_provider_in: processMaybeArray(catCanEditProviderIn),
    };

    console.log(postContent);

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    const postURL =
      props.id !== undefined && props.id !== ''
        ? `/api/users/update/${props.id}`
        : `/api/users/register`;

    try {
      const res = await axios.post(postURL, postContent);
      if (res.data.success) {
        setHadError(false);
        setSuccess(true);
        await sleep(500);
        closeModal();
        props.refreshDataCallback();
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
    resetFlags();
    if (!props.id) clearState();
  };

  const renderPasswordBox = () => {
    return (
      <>
        <Form.Group>
          <Form.Label>
            Change Password
            {props && !props.id ? ' (Default is "Password1")' : null}
          </Form.Label>
          <Select
            isClearable={false}
            value={willSetNewPassword}
            onChange={handleWillSetNewPasswordChange}
            options={boolOptions}
          />
        </Form.Group>

        {willSetNewPassword.value ? (
          <Form.Group controlId='formBasicPassword'>
            <Form.Label>New Password</Form.Label>
            <Form.Control
              value={password}
              onChange={handlePasswordChange}
              type='password'
              placeholder='Password'
              isValid={validConfirmPassword && password !== ''}
              isInvalid={!validConfirmPassword && password !== ''}
            />
          </Form.Group>
        ) : null}

        {willSetNewPassword.value ? (
          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              type='password'
              placeholder='Confirm Password'
              isValid={validConfirmPassword && password !== ''}
              isInvalid={!validConfirmPassword && password !== ''}
            />
            <Form.Control.Feedback type='invalid'>
              Passwords do not match
            </Form.Control.Feedback>
          </Form.Group>
        ) : null}
      </>
    );
  };

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
          Successfully saved user.
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

  const renderSubmitButton = () => {
    const isDisabled = willSetNewPassword.value && !validConfirmPassword;
    if (success)
      return (
        <Button
          disabled={isDisabled}
          onClick={doSubmit}
          variant='success'
          type='submit'
        >
          Success
        </Button>
      );
    else if (hadError) {
      return (
        <Button
          disabled={isDisabled}
          onClick={doSubmit}
          variant='warning'
          type='submit'
        >
          Try Again
        </Button>
      );
    } else
      return (
        <Button
          disabled={isDisabled}
          onClick={doSubmit}
          variant='primary'
          type='submit'
        >
          Submit
        </Button>
      );
  };

  return (
    <React.Fragment>
      <Button variant='primary' onClick={openModal} style={props.style}>
        {props.buttonName}
      </Button>
      <Modal show={modalIsDisplayed} onHide={closeModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>
            {props.id !== undefined && props.id !== ''
              ? `Edit ${userToEdit.email}`
              : 'Register User'}
            {props.id !== undefined && props.id !== '' ? (
              <>
                <br />
                <h6 className='text-muted'>ID: {userToEdit._id}</h6>
              </>
            ) : null}
          </Modal.Title>
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

            {renderPasswordBox()}

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
          {renderSubmitButton()}
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

UserEdit.propTypes = {
  providers: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  users: PropTypes.array,
  id: PropTypes.string,
  buttonName: PropTypes.string,
  style: PropTypes.object,
  refreshDataCallback: PropTypes.func.isRequired,
};

export default UserEdit;

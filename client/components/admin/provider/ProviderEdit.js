import React, { useState, useEffect } from 'reactn';
import { Button, Modal, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

import Form from 'react-jsonschema-form-bs4';
import ProviderSchema from './ProviderSchema';
import ProviderUiSchema from './ProviderUiSchema';

const ProviderEdit = (props) => {
  const getProviderToEditFromProps = () => {
    return props.id
      ? props.providers.filter((provider) => {
          return provider._id === props.id;
        })[0]
      : null;
  };

  const [providerToEdit, setProviderToEdit] = useState(
    getProviderToEditFromProps()
  );
  const [success, setSuccess] = useState(false);
  const [hadError, setHadError] = useState(false);
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);

  let providerForm;

  const openModal = () => {
    setModalIsDisplayed(true);
  };

  const closeModal = () => {
    setModalIsDisplayed(false);
    setHadError(false);
    setSuccess(false);
  };

  useEffect(() => {
    setProviderToEdit(getProviderToEditFromProps());
  }, [props]);

  const doSubmit = async ({ formData }, event) => {
    event.preventDefault();

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    try {
      const postURL =
        props.id !== undefined && props.id !== ''
          ? `/api/providers/update/${props.id}`
          : `/api/providers/create`;

      const res = await axios.post(postURL, formData);
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
          Successfully saved provider.
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
    if (success)
      return (
        <Button
          onClick={providerForm ? providerForm.submit() : null}
          variant='success'
          type='submit'
        >
          Success
        </Button>
      );
    else if (hadError) {
      return (
        <Button
          onClick={providerForm ? providerForm.submit() : null}
          variant='warning'
          type='submit'
        >
          Try Again
        </Button>
      );
    } else
      return (
        <Button
          onClick={providerForm ? providerForm.submit() : null}
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
            {props.id !== undefined && props.id !== '' && providerToEdit
              ? `Edit ${providerToEdit.name}`
              : 'Add Provider'}
            {props.id !== undefined && props.id !== '' && providerToEdit ? (
              <>
                <br />
                <h6 className='text-muted'>ID: {providerToEdit._id}</h6>
              </>
            ) : null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ paddingBottom: '0' }}>
          {renderStatus()}
          <Form
            noHtml5Validate={true}
            schema={ProviderSchema}
            uiSchema={ProviderUiSchema}
            formData={providerToEdit}
            onSubmit={doSubmit}
            omitExtraData={true}
            liveOmit={true}
            ref={(form) => {
              providerForm = form;
            }}
          >
            <Modal.Footer>
              <Button variant='secondary' onClick={closeModal}>
                Close
              </Button>
              {renderSubmitButton()}
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

ProviderEdit.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  buttonName: PropTypes.string.isRequired,
  refreshDataCallback: PropTypes.func.isRequired,
  providers: PropTypes.array.isRequired,
};

export default ProviderEdit;

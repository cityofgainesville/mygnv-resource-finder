import React, { useState, useEffect } from 'reactn';
import { Button, Modal, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

// Provider delete modal with delete confirmation

const ProviderDelete = (props) => {
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

  const doSubmit = async (event) => {
    event.preventDefault();

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    try {
      const res = await axios.delete(`/api/providers/delete/${props.id}`);
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
          Successfully deleted provider.
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

  return (
    <React.Fragment>
      <Button variant='danger' onClick={openModal} style={props.style}>
        {props.buttonName}
      </Button>
      <Modal show={modalIsDisplayed} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {props.id !== undefined && props.id !== '' && providerToEdit
              ? `Delete ${providerToEdit.name}`
              : 'Delete Provider'}
            {props.id !== undefined && props.id !== '' && providerToEdit ? (
              <>
                <br />
                <h6 className='text-muted'>ID: {providerToEdit._id}</h6>
              </>
            ) : null}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderStatus()}
          <Alert
            variant='danger'
            style={{
              marginTop: '1em',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            DANGER: This operation is irreversible. Be ABSOLUTELY sure that this
            is what you intend to do. THIS WILL IRREVERSIBLY DELETE THE
            PROVIDER.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            Close
          </Button>
          <Button onClick={doSubmit} variant='danger' type='submit'>
            Delete Provider
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

ProviderDelete.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  buttonName: PropTypes.string.isRequired,
  refreshDataCallback: PropTypes.func.isRequired,
  providers: PropTypes.array.isRequired,
};

export default ProviderDelete;

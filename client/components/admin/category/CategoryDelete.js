import React, { useState, useGlobal, useEffect } from 'reactn';
import { Button, Modal, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

// Category delete modal with delete confirmation

const CategoryDelete = (props) => {
  const [currentUser] = useGlobal('currentUser');

  const getCategoryToEditFromProps = () => {
    return props.id
      ? props.categories.filter((category) => {
        return category._id === props.id;
      })[0]
      : null;
  };

  const [categoryToEdit, setCategoryToEdit] = useState(
    getCategoryToEditFromProps()
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

  const doSubmit = async (event) => {
    event.preventDefault();

    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };

    try {
      const res = await axios.delete(`/api/categories/delete/${props.id}`);
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
          Successfully deleted category.
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
        Delete
      </Button>
      <Modal show={modalIsDisplayed} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Delete {categoryToEdit.name}
            <br />
            <h6 className="text-muted">ID: {categoryToEdit._id}</h6>
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
            CATEGORY.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={closeModal}>
            Close
          </Button>
          <Button onClick={doSubmit} variant='danger' type='submit'>
            Delete Category
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

CategoryDelete.propTypes = {
  id: PropTypes.string,
  style: PropTypes.object,
  buttonName: PropTypes.string.isRequired,
  refreshDataCallback: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default CategoryDelete;

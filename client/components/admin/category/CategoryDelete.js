import React, { useState, useGlobal, useEffect } from 'reactn';
import { Button, Modal, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

// Category delete modal with delete confirmation

const CategoryDelete = (props) => {
  const [currentUser] = useGlobal('currentUser');

  const [category, setCategory] = useState(
    props.id
      ? props.categories.filter((category) => {
          return category._id === props.id;
        })[0]
      : null
  );

  const [hadError, setHadError] = useState(false);
  const [modalIsDisplayed, setModalIsDisplayed] = useState(false);

  const openModal = () => {
    setModalIsDisplayed(true);
  };

  const closeModal = () => {
    setModalIsDisplayed(false);
    setHadError(false);
  };

  const submit = (event) => {
    event.preventDefault();
    axios
      .delete(`/api/categories/delete/${props.id}`)
      .then((res) => {
        closeModal();
        props.refreshDataCallback();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <Button variant='danger' onClick={openModal} style={props.style}>
        Delete
      </Button>
      <Modal show={modalIsDisplayed} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {category.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button onClick={submit} variant='danger' type='submit'>
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

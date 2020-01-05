import React from 'reactn';
import { Button, Modal, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

// Category delete modal with delete confirmation

class SubCategoryEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {
        name: '',
        subcategory_of: [],
        icon_name: '',
        is_lowest_level: false,
      },
      hadError: false,
      modalIsDisplayed: false,
    };
  }

  componentDidMount() {
    const id = this.props.id;
    if (id !== undefined && id !== null && id !== '') {
      axios
        .get(`/api/category/${id}`)
        .then((res) => {
          this.setState({ category: res.data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleNameChange = (event) => {
    this.setState({
      category: Object.assign({}, this.state.category, {
        name: event.target.value,
      }),
    });
  };

  handleIsLowestLevelChange = (event) => {
    this.setState({
      category: Object.assign({}, this.state.category, {
        is_lowest_level: !this.state.category.is_lowest_level,
      }),
    });
  };

  handleSubcategoryOfChange = (subCategoryOf) => {
    this.setState({
      category: Object.assign({}, this.state.category, {
        subcategory_of: subCategoryOf,
      }),
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

  submit = (event) => {
    event.preventDefault();
    axios
      .delete(`/api/category/${this.props.id}`)
      .then((res) => {
        this.closeModal();
        this.props.handleRefreshData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <Button variant='danger' onClick={this.openModal}>
          Delete
        </Button>
        <Modal show={this.state.modalIsDisplayed} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete {this.state.category.name}</Modal.Title>
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
              DANGER: This operation is irreversible. Be ABSOLUTELY sure that
              this is what you intend to do. THIS WILL IRREVERSIBLY DELETE THE
              CATEGORY.
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.closeModal}>
              Close
            </Button>
            <Button onClick={this.submit} variant='danger' type='submit'>
              Delete Category
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

SubCategoryEdit.propTypes = {
  id: PropTypes.string.isRequired,
  handleRefreshData: PropTypes.func.isRequired,
};

export default SubCategoryEdit;

import React from 'reactn';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubCategoryFormElement from './SubCategoryFormElement';

// Subcategory edit modal form, uses custom multiselect form element
// Used for category admin portal

class SubCategoryEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {
        name: '',
        subcategory_of: [],
        icon_name: 'null',
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
    if (this.props.id !== undefined && this.props.id !== '') {
      axios
        .post(`/api/category/${this.props.id}`, this.state.category)
        .then((res) => {
          this.closeModal();
          this.props.handleRefreshData();
        })
        .catch((err) => {
          console.log(err);
          this.setState({ hadError: true });
        });
    } else {
      axios
        .post(`/api/category/`, this.state.category)
        .then((res) => {
          this.closeModal();
          this.props.handleRefreshData();
        })
        .catch((err) => {
          console.log(err);
          this.setState({ hadError: true });
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Button variant='primary' onClick={this.openModal}>
          {this.props.buttonName}
        </Button>
        <Modal show={this.state.modalIsDisplayed} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.id !== undefined && this.props.id !== ''
                ? `Edit ${this.state.category.name}`
                : 'Add SubCategory'}
            </Modal.Title>
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
              <Form.Group controlId='formName'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={this.state.category.name}
                  onChange={this.handleNameChange}
                  placeholder='Name'
                />
              </Form.Group>

              <Form.Group controlId='formLowestLevelCategoryCheckbox'>
                <Form.Switch
                  checked={this.state.category.is_lowest_level}
                  onChange={this.handleIsLowestLevelChange}
                  type='checkbox'
                  label='Lowest Level Category'
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  Subcategory Of: (Multi-selection possible)
                </Form.Label>
                <SubCategoryFormElement
                  id={this.props.id}
                  handleSubCategoryOfChange={this.handleSubcategoryOfChange}
                  subCategoryOf={
                    this.state.category.subcategory_of !== undefined
                      ? this.state.category.subcategory_of
                      : []
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.closeModal}>
              Close
            </Button>
            <Button onClick={this.submit} variant='primary' type='submit'>
              Submit Edits
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

SubCategoryEdit.propTypes = {
  id: PropTypes.string,
  buttonName: PropTypes.string.isRequired,
  handleRefreshData: PropTypes.func.isRequired,
};

export default SubCategoryEdit;

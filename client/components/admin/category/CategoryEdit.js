import React from 'reactn';
import { Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import axios from 'axios';

// Category edit modal form, uses custom multiselect form element
// Used for category admin portal

class CategoryEdit extends React.Component {
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
    axios
      .get(`/api/category/${this.props.id}`)
      .then((res) => {
        this.setState({ category: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleNameChange = (event) => {
    this.setState({
      category: Object.assign({}, this.state.category, {
        name: event.target.value,
      }),
    });
  };

  handleIconNameChange = (event) => {
    this.setState({
      category: Object.assign({}, this.state.category, {
        icon_name: event.target.value,
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

  handleSubcategoryOfChange = (event) => {
    console.log(event.target.value);
    this.setState({
      category: Object.assign({}, this.state.category, {
        subcategory_of: event.target.value,
      }),
    });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
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
                : 'Add Category'}
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

              <Row>
                <Col>
                  <Form.Group controlId='formIconName'>
                    <Form.Label>Icon Name</Form.Label>
                    <Form.Control
                      value={this.state.category.icon_name}
                      onChange={this.handleIconNameChange}
                      placeholder='Fontawesome Icon Name'
                    />
                  </Form.Group>
                </Col>
                <Col sm='auto'>
                  <Form.Label>Icon Preview</Form.Label>
                  <i
                    className={`fal fa-${
                      this.state.category.icon_name
                    } fa-${3}x`}
                    style={{
                      margin: 'auto',
                      display: 'block',
                    }}
                  ></i>
                </Col>
              </Row>

              <Form.Group controlId='formLowestLevelCategoryCheckbox'>
                <Form.Switch
                  checked={this.state.category.is_lowest_level}
                  onChange={this.handleIsLowestLevelChange}
                  type='checkbox'
                  label='Lowest Level Category'
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

CategoryEdit.propTypes = {
  id: PropTypes.string,
  buttonName: PropTypes.string.isRequired,
  handleRefreshData: PropTypes.func.isRequired,
};

export default CategoryEdit;

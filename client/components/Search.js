import React from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ListGroup, Container, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../RouterPaths';

// Search component for all providers,
// When provider is clicked redirects to
// individual provider view

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { providers: [], filterText: '' };
  }

  // Loads in all providers for filtering through
  componentDidMount() {
    axios
      .get(`/api/provider`)
      .then((res) => {
        this.setState({ providers: res.data });
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleFilterChange = (event) => {
    this.setState({ filterText: event.target.value });
  };

  doRedirect = (providerId) => {
    this.props.history.push(`${paths.individualProviderPath}/${providerId}`);
  };

  render() {
    const providerList = this.state.providers
      .filter((provider) => {
        return provider.name
          .toLowerCase()
          .includes(this.state.filterText.toLowerCase());
      })
      .map((provider) => {
        return (
          <ListGroup.Item
            key={provider._id}
            action
            onClick={() => this.doRedirect(provider._id)}
          >
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <h5 style={{ color: 'black', fontWeight: 'bold' }}>
                {provider.name}
              </h5>
              <p>
                {provider.services_provided}
                {'\n'}
              </p>
              {provider.addresses.map((addresses) => (
                <p key={`${provider._id}_address`} style={{ color: 'black' }}>
                  {addresses.line_1}
                  {'\n'}
                  {addresses.state} {addresses.zipcode}
                </p>
              ))}
            </div>
          </ListGroup.Item>
        );
      });
    return (
      <div>
        <Container>
          <Form style={{ width: '100%' }}>
            <Form.Group controlId='formFilterText'>
              <Form.Label>
                <strong>Search Providers</strong>
              </Form.Label>
              <Form.Control
                value={this.state.filterText}
                onChange={this.handleFilterChange}
                placeholder='Search a Provider'
              />
            </Form.Group>
          </Form>
          {providerList}
        </Container>
      </div>
    );
  }
}

Search.propTypes = {
  category: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(Search);

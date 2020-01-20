import React, { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ListGroup, Container, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../RouterPaths';

// Search component for all providers,
// When provider is clicked redirects to
// individual provider view

const Search = (props) => {
  const [providers, setProviders] = useState([]);
  const [filterText, setFilterText] = useState('');

  // Loads in all providers for filtering through
  useEffect(() => {
    axios
      .get(`/api/providers/list`)
      .then((res) => {
        setProviders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const doRedirect = (providerId) => {
    props.history.push(`${paths.providerPath}/${providerId}`);
  };

  const providerList = providers
    .filter((provider) => {
      return (
        provider.name.toLowerCase().includes(filterText.toLowerCase()) ||
        provider._id.includes(filterText)
      );
    })
    .map((provider) => {
      return (
        <ListGroup.Item
          key={provider._id}
          action
          onClick={() => doRedirect(provider._id)}
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
              value={filterText}
              onChange={handleFilterChange}
              placeholder='Search a Provider'
            />
          </Form.Group>
        </Form>
        {providerList}
      </Container>
    </div>
  );
};

Search.propTypes = {
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(Search);

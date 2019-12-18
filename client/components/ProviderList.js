import React from 'reactn';
import PropTypes from 'prop-types';

import axios from 'axios';
import { ListGroup, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import paths from '../RouterPaths';

class ProviderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { providers: [] };
  }

  // Gets list of providers corresponding with subcategory._id
  componentDidMount() {
    axios
      .get(`/api/provider/subCategory/${this.props.category._id}`)
      .then((res) => {
        this.setState({ providers: res.data });
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // On click, redirects to individual provider view of clicked provider
  doRedirect = (providerId) => {
    this.props.history.push(`${paths.individualProviderPath}/${providerId}`);
  };

  // Renders a list of provider in subcategory, provides summary and
  // address quick view
  render() {
    const providerList = this.state.providers.map((provider) => {
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
    return <Container>{providerList}</Container>;
  }
}

ProviderList.propTypes = {
  category: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(ProviderList);

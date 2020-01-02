import React from 'reactn';
import PropTypes from 'prop-types';

import { ListGroup, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import paths from '../../RouterPaths';

class SubcategoryProviderList extends React.Component {
  constructor(props) {
    super(props);
  }

  // On click, redirects to individual provider view of clicked provider
  doRedirect = (providerId) => {
    this.props.history.push(`${paths.providerPath}/${providerId}`);
  };

  // Renders a list of provider in subcategory, provides summary and
  // address quick view
  render() {
    console.log(this.props.providers);
    const providerList = this.props.providers.map((provider) => {
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

SubcategoryProviderList.propTypes = {
  providers: PropTypes.instanceOf(Array).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(SubcategoryProviderList);

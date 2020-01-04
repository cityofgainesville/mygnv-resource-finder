import React from 'reactn';
import PropTypes from 'prop-types';
import { ListGroup, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import paths from '../../RouterPaths';
import './SubcategoryProviderList.scss';

const SubcategoryProviderList = (props) => {
  // On click, redirects to individual provider view of clicked provider
  const doRedirect = (providerId) => {
    props.history.push(`${paths.providerPath}/${providerId}`);
  };

  // Renders a list of provider in subcategory, provides summary and
  // address quick view
  console.log(props.providers);
  const providerList = props.providers.map((provider) => {
    return (
      <ListGroup.Item
        key={provider._id}
        action
        onClick={() => doRedirect(provider._id)}
      >
        <div className='subcat-provider-div'>
          <h5 className='subcat-provider-h5'>{provider.name}</h5>
          <p>
            {provider.services_provided}
            {'\n'}
            {'\n'}
          </p>
          {provider.addresses.map((addresses) => (
            <p
              key={`${provider._id}_address`}
              className='subcat-provider-address'
            >
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
};

SubcategoryProviderList.propTypes = {
  providers: PropTypes.instanceOf(Array).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(SubcategoryProviderList);

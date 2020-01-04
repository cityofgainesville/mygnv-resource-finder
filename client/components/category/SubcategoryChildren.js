import React from 'reactn';
import PropTypes from 'prop-types';
import { Container, ListGroup } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import './SubcategoryChildren.scss';

import paths from '../../RouterPaths';

const SubcategoryChildren = (props) => {
  const doRedirect = (providerId) => {
    props.history.push(`${paths.categoryPath}/${providerId}`);
  };

  const categoryList = props.category.children.map((category) => {
    return (
      <ListGroup.Item
        key={category._id}
        className='flex-column'
        action
        onClick={() => doRedirect(category._id)}
      >
        {category.name}
      </ListGroup.Item>
    );
  });

  return (
    <React.Fragment>
      <Container className={'subcat-children-container-width'}>
        {categoryList}
      </Container>
    </React.Fragment>
  );
};

SubcategoryChildren.propTypes = {
  category: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(SubcategoryChildren);

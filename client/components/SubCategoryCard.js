import React from 'reactn';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import RedirectButton from './RedirectButton';

// Redirect component for subcategory

class SubCategoryCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <RedirectButton className='flex-column' path={this.props.path}>
        {this.props.categoryName}
      </RedirectButton>
    );
  }
}

SubCategoryCard.propTypes = {
  categoryName: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
};

export default withRouter(SubCategoryCard);

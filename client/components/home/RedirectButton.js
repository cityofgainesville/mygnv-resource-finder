import React,  { useState, useEffect } from 'reactn';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

import { withRouter } from 'react-router-dom';

// A bootstrap button that redirects on click
// Using the html5 history API and react router
// this allows back, forward buttons to work in the browser

const RedirectButton = (props) => {
  const doRedirect = () => {
    props.history.push(props.path);
  };

  return (
    <React.Fragment>
      <Button
        onClick={doRedirect}
        className={props.className}
        variant={props.variant}
      >
        {props.children}
      </Button>
    </React.Fragment>
  );
};

RedirectButton.propTypes = {
  path: PropTypes.string.isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  children: PropTypes.any,
  className: PropTypes.string,
  variant: PropTypes.string,
};

RedirectButton.defaultProps = {
  className: '',
  variant: 'outline-primary',
};

export default withRouter(RedirectButton);

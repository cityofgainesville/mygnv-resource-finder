import React, { useGlobal } from 'reactn';
import { Route, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import paths from './RouterPaths';

// A protected route component, not currently used since
// modals are used for the admin portal, but can be useful

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [currentUser] = useGlobal('currentUser');

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: paths.adminPath,
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

ProtectedRoute.propTypes = {
  component: PropTypes.instanceOf(React.Component).isRequired,
  location: PropTypes.string.isRequired,
};

export default withRouter(ProtectedRoute);

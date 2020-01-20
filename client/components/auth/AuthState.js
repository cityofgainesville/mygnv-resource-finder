import { useGlobal, useEffect, setGlobal } from 'reactn';
import axios from 'axios';

// Populates useGlobal('currentUser') with the logged in user's session and role details
// if const [currentUser] = useGlobal('currentUser'), and currentUser is null, user is not logged in or this is still getting user data
// ReactN is used for this global user state
// Used in App.js, runs on first render to check if session is active

const AuthState = (props) => {
  // eslint-disable no-unused-vars
  const [, setCurrentUser] = useGlobal('currentUser');

  const checkIfAuthenticated = () => {
    axios
      .post('/api/users/isLoggedIn')
      .then((res) => {
        if (res.data.success) setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Check if the user is already logged in (if they refresh the page)
  useEffect(() => {
    checkIfAuthenticated();
    setGlobal({
      currentUser: null,
    });
  }, []);

  return null;
};

export default AuthState;

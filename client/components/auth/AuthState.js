import React, { useGlobal, useEffect } from 'reactn';
import axios from 'axios';

// Populates this.global.isAuthenticated with true or false
// and this.global.userEmail with authenticated user's email

// Used in App.js, runs on first render to check if session is active

const AuthState = (props) => {
  const [currentUser, setCurrentUser] = useGlobal('currentUser');

  const checkIfAuthenticated = () => {
    axios
      .post('/api/user/isLoggedIn')
      .then((res) => {
        if (res.data.success) setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const testStuff = () => {
    axios.post('/api/user/update').then((res) => {});
  };

  // Check if the user is already logged in (if they refresh the page)
  useEffect(() => {
    checkIfAuthenticated();
    // testStuff();
  }, []);

  return null;
};

export default AuthState;

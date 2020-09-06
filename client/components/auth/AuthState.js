import { getGlobal, useGlobal, useEffect, setGlobal } from 'reactn';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Populates useGlobal('currentUser') with the logged in user's session and role details
// if const [currentUser] = useGlobal('currentUser'), and currentUser is null, user is not logged in or this is still getting user data
// ReactN is used for this global user state
// Used in App.js, runs on first render to check if session is active

const AuthState = (props) => {
  // eslint-disable no-unused-vars
  const [, setCurrentUser] = useGlobal('currentUser');
  const [, setToken] = useGlobal('token');

  const updateToken = async () => {
    try {
      const response = await axios.post(
        '/api/auth/refresh-token',
        {},
        { withCredentials: true }
      );
      setCurrentUser(response.data.user);
      setToken(response.data.access_token);
      return response;
    } catch (error) {
      return null;
    }
  };

  axios.interceptors.response.use(
    (response) => {
      // Return a successful response back to the calling service
      return response;
    },
    async (error) => {
      // Return any error which is not due to authentication back to the calling service
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      // Don't retry on login
      if (error.config.url == '/api/auth/login') {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      // Logout user if token refresh didn't work
      if (error.config.url == '/api/auth/refresh-token') {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      const token = getGlobal().token;

      if (!token || jwtDecode(token).exp < Date.now() / 1000) {
        try {
          const response = await updateToken();
          if (!response) {
            return Promise.reject(error);
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }

      // Try request again
      const config = error.config;
      config.headers['Authorization'] = `Bearer ${getGlobal().token}`;

      return new Promise((resolve, reject) => {
        axios
          .request(config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  );

  // Check if the user is already logged in (if they refresh the page)
  useEffect(() => {
    updateToken();
    setGlobal({
      currentUser: null,
      token: null,
    });
  }, []);

  return null;
};

export default AuthState;

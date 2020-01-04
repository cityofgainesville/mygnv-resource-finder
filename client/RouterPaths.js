// Holds router variables and generates router paths from category names

const mainPath = '/';
const login = '/login';
const register = '/register';

const adminPath = '/admin';
const categoriesAdminPath = `${adminPath}/categories`;
const providersAdminPath = `${adminPath}/providers`;
const usersAdminPath = `${adminPath}/users`;

const categoryPath = '/categories';
const providerPath = '/provider';
const searchPath = '/search';

/* eslint-disable no-unused-vars */
const paths = {
  mainPath,
  login,
  register,

  adminPath,
  categoriesAdminPath,
  providersAdminPath,
  usersAdminPath,

  categoryPath,
  providerPath,
  searchPath,
};

export default paths;

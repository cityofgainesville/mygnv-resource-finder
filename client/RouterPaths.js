// Holds router variables and generates router paths from category names

const cleanPath = (path) => {
  return path.replace(/[^a-zA-Z0-9-_]/g, '');
};

// Given a category, generate a path
const generateCategoryPath = (category, endPath = '') => {
  if (category.subcategory_of.length > 0) {
    return generateCategoryPath(
      category.subcategory_of[0],
      cleanPath(category.name),
    );
  } else {
    return (
      topLevelCategoriesPath + '/' + cleanPath(category.name) + '/' + endPath
    );
  }
};

const mainPath = '/';
const login = '/login';
const register = '/register';
const individualProviderPath = '/provider';

const adminPath = '/admin';
const categoriesAdminPath = `${adminPath}/categories`;
const providersAdminPath = `${adminPath}/providers`;
const usersAdminPath = `${adminPath}/users`;

const topLevelCategoriesPath = '/categories';
const individualPath = '/provider';
const searchPath = '/search';

/* eslint-disable no-unused-vars */
const paths = {
  mainPath,
  login,
  register,
  individualProviderPath,

  adminPath,
  categoriesAdminPath,
  providersAdminPath,
  usersAdminPath,

  topLevelCategoriesPath,
  individualPath,
  generateCategoryPath,
  searchPath,
};

export default paths;

// Holds router path variables

const mainPath = '/home';
const defaultPath = '/';

const adminPath = '/admin';
const categoriesAdminPath = `${adminPath}/categories`;
const providersAdminPath = `${adminPath}/providers`;
const usersAdminPath = `${adminPath}/users`;

const categoryPath = `${mainPath}/categories`;
const providerDetailPath = '/providers/provider';
const providerPath = '/providers';

const hotlinesPath = '/hotlines';
const safeplacesPath = `${mainPath}/safeplaces`;
const covidPath = `${mainPath}/covid19`;

const menuPath = '/title';
const searchPath = '/search';

const paths = {
  mainPath,
  defaultPath,

  adminPath,
  categoriesAdminPath,
  providersAdminPath,
  usersAdminPath,

  categoryPath,
  providerDetailPath,
  providerPath,

  hotlinesPath,
  safeplacesPath,
  covidPath,

  menuPath,
  searchPath,

};

export default paths;

// Holds router path variables

const mainPath = '/home';
const defaultPath = '/';

const adminPath = '/admin';
const categoriesAdminPath = `${adminPath}/categories`;
const providersAdminPath = `${adminPath}/providers`;
const usersAdminPath = `${adminPath}/users`;

const categoryPath = `${mainPath}/categories`;
const providerPath = `${mainPath}/provider`;
const searchPath = `${mainPath}/search`;

const hotlinesPath = `${mainPath}/hotlines`;
const safeplacesPath = `${mainPath}/safeplaces`;
const covidPath = `${mainPath}/covid19`;

const menuPath = `${mainPath}/title`;

const paths = {
  mainPath,
  defaultPath,

  adminPath,
  categoriesAdminPath,
  providersAdminPath,
  usersAdminPath,

  categoryPath,
  providerPath,
  searchPath,

  hotlinesPath,
  safeplacesPath,
  covidPath,

  menuPath,

};

export default paths;

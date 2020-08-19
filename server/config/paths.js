module.exports.resourcesURI = {
  path: '/api/resources',
  endpoints: {
    list: '/list',
    create: '/create',
    update: '/update',
    delete: '/delete',
  },
};

module.exports.locationsURI = {
  path: '/api/locations',
  endpoints: {},
};

module.exports.categoriesURI = {
  path: '/api/categories',
  endpoints: {
    list: '/list',
    create: '/create',
    listTopLevel: '/listTopLevel',
    update: '/update',
    delete: '/delete',
  },
};

module.exports.usersURI = {
  path: '/api/users',
  endpoints: {},
};

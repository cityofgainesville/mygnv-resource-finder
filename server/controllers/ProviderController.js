const Provider = require('../models/ProviderSchema');

// Create a provider
exports.create = (req, res) => {
  const provider = new Provider(req.body);

  provider.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(provider);
      console.log(provider);
    }
  });
};

// Get the current provider
exports.read = (req, res) => {
  res.json(req.provider);
};

// Update a provider
exports.update = (req, res) => {
  // TODO: UPDATE FIELDS FROM BODY?
  const provider = req.provider;

  provider.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(provider);
      console.log(provider);
    }
  });
};

// Delete a provider
exports.delete = (req, res) => {
  const provider = req.provider;
  Provider.deleteOne(provider, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else res.status(200).end();
  });
};

// Get all the providers
exports.list = (req, res) => {
  Provider.find({})
    .populate('categories')
    .exec((err, providers) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      } else {
        res.json(providers);
      }
    });
};

// Get all the providers in a given subcategory
exports.listSubCategory = (req, res) => {
  res.json(req.inSubcategory);
};

// Middleware to get a provider from database by ID, save in req.provider
exports.providerById = (req, res, next, id) => {
  Provider.findById(id)
    .populate('categories')
    .exec((err, provider) => {
      if (err) {
        res.status(400).send(err);
      } else {
        req.provider = provider;
        req.id = id;
        next();
      }
    });
};

// Middleware to get providers in subcategory, save in req.inSubcategory
exports.getSubCategory = (req, res, next, id) => {
  Provider.find({ categories: id })
    .populate('categories')
    .exec((err, providers) => {
      if (err) {
        res.status(400).send(err);
      } else {
        req.inSubcategory = providers;
        next();
      }
    });
};

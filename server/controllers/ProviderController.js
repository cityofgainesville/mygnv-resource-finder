const Provider = require('../models/ProviderSchema');

// Create a provider
exports.create = (req, res) => {
  if (req.user.role !== 'Owner') return res.status(403).end();
  const provider = new Provider(req.body);

  provider.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json({ success: true, provider: provider });
    }
  });
};

// Get the current provider
exports.read = (req, res) => {
  res.json(req.provider);
};

// Update a provider
exports.update = (req, res) => {
  if (req.user.role !== 'Owner') return res.status(403).end();
  // TODO: UPDATE FIELDS FROM BODY?
  const provider = req.provider;

  provider.save((err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json({ success: true, provider: provider });
    }
  });
};

// Delete a provider
exports.delete = (req, res) => {
  if (req.user.role !== 'Owner') return res.status(403).end();
  const provider = req.provider;
  Provider.deleteOne(provider, (err) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else res.json({ success: true });
  });
};

// Get all the providers
exports.list = (req, res) => {
  Provider.find({}).exec((err, providers) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      res.json(providers);
    }
  });
};

// Middleware to get a provider from database by ID, save in req.provider
exports.providerById = (req, res, next, id) => {
  Provider.findById(id).exec((err, provider) => {
    if (err) {
      res.status(400).send(err);
    } else {
      req.provider = provider;
      req.id = id;
      next();
    }
  });
};

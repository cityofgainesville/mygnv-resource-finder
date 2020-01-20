const Provider = require('../models/ProviderSchema');
const Category = require('../models/CategorySchema');

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

exports.isProviderUpdateAllowed = async (req, res, next) => {
  const currentUser = req.user;
  if (currentUser.role === 'Owner') return next();
  const providerToEdit = req.provider;
  let providers;
  let categories;
  try {
    providers = await Provider.find({});
    categories = await Category.find({});
  } catch (err) {
    console.log(err);
  }
  const allowedProviders = [];
  const categoryMap = new Map(
    Object.values(categories).map((category) => [
      category._id.toString(),
      category,
    ])
  );
  const providerMap = new Map(
    Object.values(providers).map((provider) => [
      provider._id.toString(),
      provider,
    ])
  );
  if (currentUser.role === 'Editor') {
    currentUser.provider_can_edit.forEach((id) => {
      if (!providerMap.has(id.toString())) return;
      allowedProviders.push(providerMap.get(id.toString()));
    });

    // for each category in cat_can_edit_provider_in, get all providers and stick in array
    currentUser.cat_can_edit_provider_in.forEach((id) => {
      if (!categoryMap.has(id.toString())) return;
      allowedProviders.push(
        ...categoryMap
          .get(id.toString())
          .providers.filter((id) => providerMap.has(id.toString()))
          .map((id) => {
            return providerMap.get(id.toString());
          })
      );
    });
  }
  if (
    currentUser.can_edit_assigned_provider &&
    currentUser.assigned_provider &&
    currentUser.assigned_provider !== '' &&
    providerMap.has(currentUser.assigned_provider.toString())
  )
    allowedProviders.push(
      providerMap.get(currentUser.assigned_provider.toString())
    );

  if (
    allowedProviders.filter(
      (provider) => provider._id.toString() === providerToEdit._id.toString()
    ).length > 0
  ) {
    return next();
  } else {
    return res.status(403).end();
  }
};

// Update a provider
exports.update = (req, res) => {
  // TODO: UPDATE FIELDS FROM BODY?
  const provider = req.provider;
  const infoToUpdate = req.body;

  for (const key in infoToUpdate) {
    if (
      Object.prototype.hasOwnProperty.call(infoToUpdate, key) &&
      provider[key] !== infoToUpdate[key]
    ) {
      provider[key] = infoToUpdate[key];
    }
  }

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

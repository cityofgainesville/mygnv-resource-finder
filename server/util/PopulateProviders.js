const fs = require('fs');
const util = require('util');
const mongoose = require('mongoose');
const Category = require('../models/CategorySchema');
const Provider = require('../models/ProviderSchema');
const config = require('../config/config');

// Populate mongoDB with providers from ./data.json
// Category names must match names used in PopulateCategories
// Use PopulateCategories then this script (PopulateProviders),
// to populate DB based on ./data.json

// BY DEFAULT THIS SCRIPT WILL DELETE ALL PROVIDERS AND
// REPOPULATE MONGODB. DANGER, WARNING, CAUTION!!
// BE ABSOLUTELY SURE THAT YOU WANT TO DO THIS!!

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const asyncFileRead = util.promisify(fs.readFile);

const dbPopulate = async () => {
  // PURGE ALL PREVIOUS LISTINGS FIRST
  // THIS WILL DELETE OUR DATABASE TO REPOPULATE IT
  // !! DO NOT TOUCH IF UNSURE !!
  Provider.deleteMany({}, () => {});

  let parsedJSON;
  try {
    const readFile = await asyncFileRead('./data.json', 'utf8');
    parsedJSON = JSON.parse(readFile);
  } catch (err) {
    const errStr = `[JSON Read/Parse]: ${err}`;
    console.log(errStr);
    throw errStr;
  }

  const categories = await Category.find({}).populate('subcategory_of');
  const categoryList = Object.values(categories);
  for (const providerIndex in parsedJSON) {
    if (Object.prototype.hasOwnProperty.call(parsedJSON, providerIndex)) {
      const newProvider = new Provider();
      const current = parsedJSON[providerIndex];

      // Handle basic info
      newProvider.name = current['Provider Name'];
      newProvider.services_provided = current['Services Provided'];
      newProvider.eligibility_criteria = current['Eligibility Criteria'];
      newProvider.cost_info = current['Cost'];
      newProvider.translation_available = current['Translation Available'];
      newProvider.united_way_approval = current['United Way Approval']
        .toUpperCase()
        .includes('Y');
      newProvider.additional_information = current['Additional Information'];
      newProvider.service_area = current['Service Area'];
      newProvider.email.push(current['Email Address']);
      newProvider.bus_routes.push(current['Bus Routes']);
      newProvider.website.push(current['Website']);

      // Handle phone numbers
      // Edge case if contact name exists, but not phone 1 name
      if (current['Contact Name'] !== '' && current['Phone 1 Name'] === '') {
        if (current['Phone 1'] === '') {
          newProvider.phone_numbers.push({ number: current['Contact Name'] });
        } else {
          newProvider.phone_numbers.push({
            contact: current['Contact Name'],
            number: current['Phone 1'],
          });
        }
      } else if (current['Phone 1 Name'] !== '' || current['Phone 1'] !== '') {
        if (current['Phone 1'] === '') {
          newProvider.phone_numbers.push({ number: current['Phone 1 Name'] });
        } else {
          newProvider.phone_numbers.push({
            contact: current['Phone 1 Name'],
            number: current['Phone 1'],
          });
        }
      }
      if (current['Phone 2 Name'] !== '' || current['Phone 2'] !== '') {
        if (current['Phone 2'] === '') {
          newProvider.phone_numbers.push({ number: current['Phone 2 Name'] });
        } else {
          newProvider.phone_numbers.push({
            contact: current['Phone 2 Name'],
            number: current['Phone 2'],
          });
        }
      }

      // Handle addresses
      if (current['Address 1'] !== '') {
        newProvider.addresses.push({
          line_1: current['Address 1'],
          line_2: current['Address 2'],
          state: current['State'],
          zipcode: current['Zipcode'].toString(),
        });
      }

      // Handle hours
      newProvider.hours = {
        monday: current['Hours Monday'],
        tuesday: current['Hours Tuesday'],
        wednesday: current['Hours Wednesday'],
        thursday: current['Hours Thursday'],
        friday: current['Hours Friday'],
        saturday: current['Hours Saturday'],
        sunday: current['Hours Sunday'],
      };

      // Handle appointments
      newProvider.walk_ins = current['Walk in'];
      newProvider.appointment = {
        is_required:
          current['Appointment Needed'].toUpperCase().includes('Y') ||
          !current['Walk In OK'].toUpperCase().includes('Y'),
        phone: current['Appointment Phone'],
        website: current['Appointment URL'],
        other_info:
          current['Appointment Needed'].length > 3
            ? current['Appointment Needed']
            : '',
      };

      // Handle application
      newProvider.application = {
        is_required: current['Application Needed'].toUpperCase().includes('Y'),
        apply_online: current['Application Online'].toUpperCase().includes('Y'),
        apply_in_person: current['Application In Person']
          .toUpperCase()
          .includes('Y'),
        other_info:
          current['Application Needed'].length > 3
            ? current['Application Needed']
            : '',
      };

      // Handle categories
      // Category names must match names in database!
      for (const key in current) {
        if (Object.prototype.hasOwnProperty.call(current, key)) {
          const currProperty = current[key];
          const filteredCategory = categoryList.filter((category) => {
            return (
              category !== undefined &&
              category.name !== undefined &&
              category.name.includes(key) &&
              currProperty !== ''
            );
          });
          if (
            filteredCategory.length > 0 &&
            newProvider.categories.filter((category) => {
              return category._id === filteredCategory[0]._id;
            }).length === 0
          ) {
            newProvider.categories.push(filteredCategory[0]._id);
            console.log(filteredCategory[0]);
          }
        }
      }

      let saveDoc;
      try {
        saveDoc = await newProvider.save();
      } catch (err) {
        const errStr = `[DB]: ${err}`;
        console.log(errStr);
        throw errStr;
      }
      if (saveDoc != undefined) {
        console.log(`[DB]: Successfully Saved: ${saveDoc}`);
      }
    }
  }

  return mongoose.disconnect();
};

dbPopulate();

const mongoose = require('mongoose');
const Category = require('../models/CategorySchema');
const config = require('../config/config');

// This script populates categories for mongoDB, and links them initially
// Category names must match names in JSON (./data.json)
// if used for PopulateProviders!

// BY DEFAULT THIS SCRIPT WILL DELETE ALL CATEGORIES AND
// REPOPULATE MONGODB. DANGER, WARNING, CAUTION!!
// BE ABSOLUTELY SURE THAT YOU WANT TO DO THIS!!

mongoose.connect(config.db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const makeSubcategory = (names, ...linkId) => {
  const subcategory = {};
  names.forEach((currentName) => {
    subcategory[currentName] = new Category({
      _id: new mongoose.Types.ObjectId(),
      name: currentName,
      icon_name: 'null',
      subcategory_of: [...linkId],
      is_lowest_level: true,
    });
  });
  return subcategory;
};

const topLevelCategories = {
  'Child & Families': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Child & Families',
    icon_name: 'child',
    subcategory_of: [],
    is_lowest_level: false,
  }),
  'Education': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Education',
    icon_name: 'book',
    subcategory_of: [],
    is_lowest_level: true,
  }),
  'Financial': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Financial',
    icon_name: 'money-check-edit-alt',
    subcategory_of: [],
    is_lowest_level: false,
  }),
  'Health & Wellness': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Health & Wellness',
    icon_name: 'medkit',
    subcategory_of: [],
    is_lowest_level: false,
  }),
  'Job': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Job',
    icon_name: 'clipboard',
    subcategory_of: [],
    is_lowest_level: true,
  }),
  'Legal': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Legal',
    icon_name: 'balance-scale-right',
    subcategory_of: [],
    is_lowest_level: false,
  }),
  'Crisis Events': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Crisis Events',
    icon_name: 'hands-helping',
    subcategory_of: [],
    is_lowest_level: false,
  }),
  'Transportation': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Transportation',
    icon_name: 'bus-alt',
    subcategory_of: [],
    is_lowest_level: true,
  }),
  'Basic Needs': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Basic Needs',
    icon_name: 'utensils-alt',
    subcategory_of: [],
    is_lowest_level: false,
  }),
  'Other': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Other',
    icon_name: 'ellipsis-v',
    subcategory_of: [],
    is_lowest_level: false,
  }),
};

const elderServices = makeSubcategory(
  ['Elder Services'],
  topLevelCategories['Child & Families']._id,
  topLevelCategories['Health & Wellness']._id,
);

const domesticViolence = makeSubcategory(
  ['Domestic Violence/ Abuse'],
  topLevelCategories['Child & Families']._id,
  topLevelCategories['Crisis Events']._id,
);

const childAndFamilies = makeSubcategory(
  ['Adoption', 'Women & Infants'],
  topLevelCategories['Child & Families']._id,
);

const financial = makeSubcategory(
  ['Eviction/ Foreclosure', 'Social Security', 'Utilities'],
  topLevelCategories['Financial']._id,
);

const healthAndWellness = makeSubcategory(
  [
    'Acupuncture',
    'Cancer-Related',
    'Recreation / Fitness',
    'Dental',
    'Disability',
    'HIV-Related',
    'Massage Therapy',
    'Medical',
    'Mental Health',
    'Occupational Therapy',
    'Pharmacy',
    'Physical Therapy',
    'Substance Abuse',
    'Vision Care',
    'Women\'s Health',
  ],
  topLevelCategories['Health & Wellness']._id,
);

const legal = makeSubcategory(
  [
    'Civil Liberties/ Social Justice',
    'Immigration',
    'Law Enforcement',
    'Photo Identification',
    'Voter Registration',
  ],
  topLevelCategories['Legal']._id,
);

const crisisEvents = makeSubcategory(
  ['Crisis Counseling', 'Disaster', 'Shelters', 'Victim Services'],
  topLevelCategories['Crisis Events']._id,
);

const basicNeeds = makeSubcategory(
  ['Clothing', 'Food Assistance', 'Housing'],
  topLevelCategories['Basic Needs']._id,
);

const other = makeSubcategory(
  [
    'Burial',
    'Computer',
    'Information and Referral',
    'Veterans',
    'Veterinary / Animal Services',
    'Miscellaneous',
  ],
  topLevelCategories['Other']._id,
);

const dbPopulate = async () => {
  // PURGE ALL PREVIOUS CATEGORIES FIRST
  // THIS WILL DELETE OUR DATABASE TO REPOPULATE IT
  // !! DO NOT TOUCH IF UNSURE !!
  Category.deleteMany({}, () => {});

  const categoryObjects = [
    topLevelCategories,

    domesticViolence,
    elderServices,

    childAndFamilies,
    financial,
    healthAndWellness,
    legal,
    crisisEvents,
    basicNeeds,
    other,
  ];

  const makeCategoryList = (categoryArray) => {
    const allCategories = [];
    categoryArray.forEach((element) => {
      allCategories.push(...Object.values(element));
    });
    return allCategories;
  };

  const categoryList = makeCategoryList(categoryObjects);

  for (const catIndex in categoryList) {
    if (Object.prototype.hasOwnProperty.call(categoryList, catIndex)) {
      let saveDoc;
      try {
        saveDoc = await categoryList[catIndex].save();
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

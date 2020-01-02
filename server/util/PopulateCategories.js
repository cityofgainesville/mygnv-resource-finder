const mongoose = require('mongoose');
const Category = require('../models/CategorySchema');

// Populate process.env
require('dotenv').config({ path: '../../.env' });

// This script populates categories for mongoDB, and links them initially
// Category names must match names in JSON (./data.json)
// if used for PopulateProviders!

// BY DEFAULT THIS SCRIPT WILL DELETE ALL CATEGORIES AND
// REPOPULATE MONGODB. DANGER, WARNING, CAUTION!!
// BE ABSOLUTELY SURE THAT YOU WANT TO DO THIS!!

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const makeSubcategories = (names, parentNames, parentCategories) => {
  const subcategories = {};
  names.forEach((currentName) => {
    subcategories[currentName] = new Category({
      _id: new mongoose.Types.ObjectId(),
      name: currentName,
      icon_name: 'null',
      isSubcategory: true,
    });
    parentNames.forEach((parentName) => {
      parentCategories[parentName].children.push(
        subcategories[currentName]._id
      );
    });
  });
  return subcategories;
};

const topLevelCategories = {
  'Child & Families': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Child & Families',
    icon_name: 'child',
    isSubcategory: false,
  }),
  'Education': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Education',
    icon_name: 'book',
    isSubcategory: false,
  }),
  'Financial': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Financial',
    icon_name: 'money-check-edit-alt',
    isSubcategory: false,
  }),
  'Health & Wellness': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Health & Wellness',
    icon_name: 'medkit',
    isSubcategory: false,
  }),
  'Job': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Job',
    icon_name: 'clipboard',
    isSubcategory: false,
  }),
  'Legal': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Legal',
    icon_name: 'balance-scale-right',
    isSubcategory: false,
  }),
  'Crisis Events': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Crisis Events',
    icon_name: 'hands-helping',
    isSubcategory: false,
  }),
  'Transportation': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Transportation',
    icon_name: 'bus-alt',
    isSubcategory: false,
  }),
  'Basic Needs': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Basic Needs',
    icon_name: 'utensils-alt',
    isSubcategory: false,
  }),
  'Other': new Category({
    _id: new mongoose.Types.ObjectId(),
    name: 'Other',
    icon_name: 'ellipsis-v',
    isSubcategory: false,
  }),
};

const elderServices = makeSubcategories(
  ['Elder Services'],
  ['Child & Families', 'Health & Wellness'],
  topLevelCategories
);

const domesticViolence = makeSubcategories(
  ['Domestic Violence/ Abuse'],
  ['Child & Families', 'Crisis Events'],
  topLevelCategories
);

const childAndFamilies = makeSubcategories(
  ['Adoption', 'Women & Infants'],
  ['Child & Families'],
  topLevelCategories
);

const financial = makeSubcategories(
  ['Eviction/ Foreclosure', 'Social Security', 'Utilities'],
  ['Financial'],
  topLevelCategories
);

const healthAndWellness = makeSubcategories(
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
    "Women's Health",
  ],
  ['Health & Wellness'],
  topLevelCategories
);

const legal = makeSubcategories(
  [
    'Civil Liberties/ Social Justice',
    'Immigration',
    'Law Enforcement',
    'Photo Identification',
    'Voter Registration',
  ],
  ['Legal'],
  topLevelCategories
);

const crisisEvents = makeSubcategories(
  ['Crisis Counseling', 'Disaster', 'Shelters', 'Victim Services'],
  ['Crisis Events'],
  topLevelCategories
);

const basicNeeds = makeSubcategories(
  ['Clothing', 'Food Assistance', 'Housing'],
  ['Basic Needs'],
  topLevelCategories
);

const other = makeSubcategories(
  [
    'Burial',
    'Computer',
    'Information and Referral',
    'Veterans',
    'Veterinary / Animal Services',
    'Miscellaneous',
  ],
  ['Other'],
  topLevelCategories
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

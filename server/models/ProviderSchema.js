const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const { ObjectId } = require('mongodb');

// A schema for holding provider information
const providerSchema = new Schema({
  name: { type: String, required: true },
  services_provided: String,
  eligibility_criteria: String,
  service_area: String,
  addresses: [
    {
      line_1: {
        type: String,
        required: true,
      },
      line_2: String,
      city: String,
      state: String,
      zipcode: String,
    },
  ],
  phone_numbers: [
    {
      contact: {
        type: String,
        required: false,
      },
      number: {
        type: String,
        required: true,
      },
    },
  ],
  email: [String],
  bus_routes: [String],
  website: [String],
  hours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String,
  },
  appointment: {
    is_required: {
      type: Boolean,
      required: true,
    },
    phone: String,
    website: String,
    email: String,
    other_info: String,
  },
  walk_ins: String,
  application: {
    is_required: {
      type: Boolean,
      required: true,
    },
    apply_online: {
      type: Boolean,
      required: true,
    },
    apply_in_person: {
      type: Boolean,
      required: true,
    },
    phone: String,
    website: String,
    email: String,
    other_info: String,
  },
  cost_info: String,
  translation_available: String,
  united_way_approval: {
    type: Boolean,
    required: true,
  },
  additional_information: String,
 
});

// Add updated_at and created_at fields
providerSchema.pre('save', function(next) {
  const currDate = new Date();
  // Update the updated_at property
  /* eslint-disable babel/no-invalid-this */
  this.updated_at = currDate;
  // If created_at is not present then create it
  /* eslint-disable babel/no-invalid-this */
  if (!this.created_at) this.created_at = currDate;
  next();
});

module.exports = mongoose.model('Provider', providerSchema);

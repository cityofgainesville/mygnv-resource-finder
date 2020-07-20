const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// A schema for holding a resource, each individual location will be a child of this schema
const resourceSchema = new Schema(
  {
    name: { type: String, required: true },
    organization_description: String,
    organization_url: String,
    // Master contact information (non-published)
    maintainer_contact_info: {
      name: String,
      title: String,
      email: String,
      phone_1: String,
      phone_1_notes: String,
      phone_2: String,
      phone_2_notes: String,
    },
    locations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Location',
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    updated_at: {
      type: Date,
      default: Date.now(),
    },
    created_at: {
      type: Date,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

module.exports = mongoose.model('Resource', resourceSchema);

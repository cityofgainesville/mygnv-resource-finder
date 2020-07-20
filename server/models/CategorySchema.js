const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    resources: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    parents: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    icon_name: {
      required: true,
      type: String,
    },
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

module.exports = mongoose.model('Category', categorySchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// - name is name of schema
//   subcategory_of holds objectIDs of parent categories
// - icon_name holds fontawesome icon name, currently
//   ui only displays icons for top level categories
const categorySchema = new Schema({
  name: {
    required: true,
    type: String,
  },
  providers: [{ type: Schema.Types.ObjectId, ref: 'Provider' }],
  children: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  icon_name: {
    required: true,
    type: String,
  },
});

// Add updated_at and created_at
categorySchema.pre('save', function(next) {
  const currDate = new Date();
  // Update the updated_at property
  /* eslint-disable babel/no-invalid-this */
  this.updated_at = currDate;
  // If created_at is not present then create it
  /* eslint-disable babel/no-invalid-this */
  if (!this.created_at) this.created_at = currDate;
  next();
});

module.exports = mongoose.model('Category', categorySchema);

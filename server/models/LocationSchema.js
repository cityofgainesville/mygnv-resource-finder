const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// A schema for holding resource information for a particular location
const locationSchema = new Schema(
  {
    name: String,
    address: {
      street_1: {
        type: String,
        required: true,
      },
      street_2: String,
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
        required: true,
      },
    },
    // Should this be hardcoded to store two numbers, or should it be an array?
    phone_number_1: {
      name: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    phone_number_2: {
      name: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    // Location contact information (non-published)
    maintainer_contact_info: {
      name: String,
      title: String,
      email: String,
      phone_1: String,
      phone_1_notes: String,
      phone_2: String,
      phone_2_notes: String,
    },
    // Should we store an array of emails, or only allow a single email?
    email: String,
    // Is this an appropriate data type for bus routes?
    bus_routes: String,
    hours: {
      // Store number type, then calculate hh:mm format (number of minutes since 00:00) (24-hour time)
      monday: {
        open: {
          type: Number,
          required: true,
        },
        close: {
          type: Number,
          required: true,
        },
      },
      tuesday: {
        open: {
          type: Number,
          required: true,
        },
        close: {
          type: Number,
          required: true,
        },
      },
      wednesday: {
        open: {
          type: Number,
          required: true,
        },
        close: {
          type: Number,
          required: true,
        },
      },
      thursday: {
        open: {
          type: Number,
          required: true,
        },
        close: {
          type: Number,
          required: true,
        },
      },
      friday: {
        open: {
          type: Number,
          required: true,
        },
        close: {
          type: Number,
          required: true,
        },
      },
      saturday: {
        open: {
          type: Number,
          required: true,
        },
        close: {
          type: Number,
          required: true,
        },
      },
      sunday: {
        open: {
          type: Number,
          required: true,
        },
        close: {
          type: Number,
          required: true,
        },
      },
    },
    // Is this the appropriate data type? Should we store dates?
    services_frequency: {
      weekly: {
        type: Boolean,
        required: true,
      },
      monthly: {
        type: Boolean,
        required: true,
      },
      // Should we be storing those dates?
      specific_dates: {
        type: Boolean,
        required: true,
      },
      ad_hoc: {
        type: Boolean,
        required: true,
      },
    },
    // Is this the right type for a schedule?
    weekly_schedule: String,
    monthly_schedule: String,
    adhoc_schedule: String,
    specific_dates: [
      {
        name: { type: String, required: true },
        date: { type: Date, required: true },
      },
    ],
    additional_schedule_info: String,
    services_offered: {
      types: {
        information: { type: Boolean, required: true },
        money: { type: Boolean, required: true },
        goods: { type: Boolean, required: true },
        professional_services: { type: Boolean, required: true },
      },
      service_cost: {
        free: { type: Boolean, required: true },
        discounted: { type: Boolean, required: true },
      },
      description: String,
    },
    eligibility_criteria: {
      min_age: Number,
      max_age: Number,
      min_household_income: Number,
      max_household_number: Number,
      employment_status: {
        full_time: { type: Boolean, required: true },
        part_time: { type: Boolean, required: true },
        unemployed: { type: Boolean, required: true },
        student: { type: Boolean, required: true },
        volunteer: { type: Boolean, required: true },
        retired: { type: Boolean, required: true },
        homemaker: { type: Boolean, required: true },
        self_employed: { type: Boolean, required: true },
        unable_to_work: { type: Boolean, required: true },
      },
      education_level: {
        no_schooling: { type: Boolean, required: true },
        kindergarten: { type: Boolean, required: true },
        grade_1_11: { type: Boolean, required: true },
        grade_12: { type: Boolean, required: true },
        high_school_diploma: { type: Boolean, required: true },
        ged: { type: Boolean, required: true },
        some_college: { type: Boolean, required: true },
        vocational_certificate: { type: Boolean, required: true },
        associate_degree: { type: Boolean, required: true },
        bachelor_degree: { type: Boolean, required: true },
        master_degree: { type: Boolean, required: true },
        doctorate_degree: { type: Boolean, required: true },
      },
      housing_status: {
        homeless: { type: Boolean, required: true },
        in_shelter: { type: Boolean, required: true },
        rent: { type: Boolean, required: true },
        own: { type: Boolean, required: true },
        other: { type: Boolean, required: true },
      },
      gainesville_resident: { type: Boolean, required: true },
      alachua_resident: { type: Boolean, required: true },
      disability: { type: Boolean, required: true },
      veteran: { type: Boolean, required: true },
      gender: {
        female: { type: Boolean, required: true },
        male: { type: Boolean, required: true },
        non_binary: { type: Boolean, required: true },
      },
      ethnicity: {
        // Is this the correct format?
        native_american: { type: Boolean, required: true },
        white: { type: Boolean, required: true },
        black: { type: Boolean, required: true },
        latinx: { type: Boolean, required: true },
        middle_eastern: { type: Boolean, required: true },
        south_asian: { type: Boolean, required: true },
        east_asian: { type: Boolean, required: true },
        pacific_islander: { type: Boolean, required: true },
      },
      eligibility_details: String,
    },
    application: {
      is_required: {
        type: Boolean,
        required: true,
      },
      application_details: String,
    },
    appointment: {
      is_required: {
        type: Boolean,
        required: true,
      },
      walk_ins: {
        type: Boolean,
        required: true,
      },
      appointment_available: { type: Boolean, required: true },
      appointment_scheduling: {
        apply_phone: {
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
      },
      phone: String,
      email: String,
      url: String,
      appointment_details: String,
    },
    united_way_approved: {
      type: Boolean,
      required: true,
    },
    languages_available: {
      english: {
        type: Boolean,
        required: true,
      },
      creole: {
        type: Boolean,
        required: true,
      },
      haitian: {
        type: Boolean,
        required: true,
      },
      spanish: {
        type: Boolean,
        required: true,
      },
      others: {
        type: String,
        required: true,
      },
    },
    translation_services: {
      always_available: {
        type: Boolean,
        required: true,
      },
      by_appointment: {
        type: Boolean,
        required: true,
      },
      over_phone: {
        type: Boolean,
        required: true,
      },
    },
    // Do we want this text field?
    additional_information: String,
    resource: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
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

module.exports = mongoose.model('Location', locationSchema);

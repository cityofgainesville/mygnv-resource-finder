const ProviderSchema = {
  definitions: {
    Thing: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          default: 'Default name',
        },
      },
    },
  },
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Provider name',
    },
    services_provided: {
      type: 'string',
      title: 'Services provided',
    },
    eligibility_criteria: {
      type: 'string',
      title: 'Eligibility criteria',
    },
    service_area: {
      type: 'string',
      title: 'Service area',
    },
    addresses: {
      type: 'array',
      title: 'Addresses',
      items: {
        type: 'object',
        required: ['line_1'],
        properties: {
          line_1: {
            type: 'string',
            title: 'Line 1',
          },
          line_2: {
            type: 'string',
            title: 'Line 2',
          },
          city: {
            type: 'string',
            title: 'City',
          },
          state: {
            type: 'string',
            title: 'State',
          },
          zipcode: {
            type: 'string',
            title: 'Zipcode',
          },
        },
      },
    },
    phone_numbers: {
      type: 'array',
      title: 'Phone numbers',
      items: {
        type: 'object',
        required: ['number'],
        properties: {
          contact: {
            type: 'string',
            title: 'Contact',
          },
          number: {
            type: 'string',
            title: 'Number',
          },
        },
      },
    },
    email: {
      type: 'array',
      title: 'Emails',
      items: {
        type: 'string',
        default: '',
      },
    },
    bus_routes: {
      type: 'array',
      title: 'Bus Routes',
      items: {
        type: 'string',
      },
    },
    website: {
      type: 'array',
      title: 'Websites',
      items: {
        type: 'string',
      },
    },
    hours: {
      type: 'object',
      title: 'Operating Hours',
      required: [],
      properties: {
        monday: {
          type: 'string',
          title: 'Monday',
        },
        tuesday: {
          type: 'string',
          title: 'Tuesday',
        },
        wednesday: {
          type: 'string',
          title: 'Wednesday',
        },
        thursday: {
          type: 'string',
          title: 'Thursday',
        },
        friday: {
          type: 'string',
          title: 'Friday',
        },
        saturday: {
          type: 'string',
          title: 'Saturday',
        },
        sunday: {
          type: 'string',
          title: 'Sunday',
        },
      },
    },
    appointment: {
      type: 'object',
      title: 'Appointment Information',
      required: [],
      properties: {
        is_required: {
          type: 'boolean',
          title: 'Is Required',
        },
        phone: {
          type: 'string',
          title: 'Phone',
        },
        website: {
          type: 'string',
          title: 'Website',
        },
        email: {
          type: 'string',
          title: 'Email',
        },
        other_info: {
          type: 'string',
          title: 'Other Info',
        },
      },
    },
    walk_ins: {
      type: 'string',
      title: 'Walk-In Information',
    },
    application: {
      type: 'object',
      title: 'Application Information',
      required: [],
      properties: {
        is_required: {
          type: 'boolean',
          title: 'Is Required',
        },
        apply_online: {
          type: 'boolean',
          title: 'Can Apply Online',
        },
        apply_in_person: {
          type: 'boolean',
          title: 'Can Apply In Person',
        },
        phone: {
          type: 'string',
          title: 'Phone',
        },
        website: {
          type: 'string',
          title: 'Website',
        },
        email: {
          type: 'string',
          title: 'Email',
        },
        other_info: {
          type: 'string',
          title: 'Other Info',
        },
      },
    },
    cost_info: {
      type: 'string',
      title: 'Cost Information',
    },
    translation_available: {
      type: 'string',
      title: 'Translation Availability',
    },
    united_way_approval: {
      type: 'boolean',
      title: 'United Way Approval',
    },
    additional_information: {
      type: 'string',
      title: 'Additional Information',
    },
  },
};

export default ProviderSchema;

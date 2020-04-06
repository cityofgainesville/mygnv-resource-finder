const ProviderUiSchema = {
  name: {
    'ui:widget': 'text',
  },
  services_provided: {
    'ui:widget': 'textarea',
    'ui:emptyValue': '',
  },
  eligibility_criteria: {
    'ui:widget': 'textarea',
    'ui:emptyValue': '',
  },
  service_area: {
    'ui:widget': 'text',
    'ui:emptyValue': '',
  },
  addresses: {
    'ui:options': {
      orderable: false,
    },
    'ui:emptyValue': [],
    'items': {
      line_1: { 'ui:widget': 'text' },
      line_2: { 'ui:widget': 'text' },
      city: { 'ui:widget': 'text' },
      state: { 'ui:widget': 'text' },
      zipcode: { 'ui:widget': 'text' },
    },
  },
  phone_numbers: {
    'ui:options': {
      orderable: false,
    },
    'ui:emptyValue': [],
    'items': {
      contact: { 'ui:widget': 'text' },
      number: { 'ui:widget': 'text' },
    },
  },
  email: {
    'ui:widget': 'text',
    'ui:emptyValue': [],
    'ui:options': {
      orderable: false,
    },
  },
  bus_routes: {
    'ui:widget': 'text',
    'ui:emptyValue': [],
    'ui:options': {
      orderable: false,
    },
  },
  website: {
    'ui:widget': 'text',
    'ui:emptyValue': [],
    'ui:options': {
      orderable: false,
    },
  },
  hours: {
    monday: { 'ui:widget': 'text' },
    tuesday: { 'ui:widget': 'text' },
    wednesday: { 'ui:widget': 'text' },
    thursday: { 'ui:widget': 'text' },
    friday: { 'ui:widget': 'text' },
    saturday: { 'ui:widget': 'text' },
    sunday: { 'ui:widget': 'text' },
  },
  appointment: {
    is_required: { 'ui:widget': 'radio' },
    phone: { 'ui:widget': 'text' },
    website: { 'ui:widget': 'text' },
    email: { 'ui:widget': 'text' },
    other_info: { 'ui:widget': 'textarea' },
  },
  walk_ins: { 'ui:widget': 'textarea', 'ui:emptyValue': '' },
  application: {
    is_required: { 'ui:widget': 'radio' },
    apply_online: { 'ui:widget': 'radio' },
    apply_in_person: { 'ui:widget': 'radio' },
    phone: { 'ui:widget': 'text' },
    website: { 'ui:widget': 'text' },
    email: { 'ui:widget': 'text' },
    other_info: { 'ui:widget': 'textarea' },
  },
  cost_info: {
    cost_type: { 'ui:widget': 'textarea' },
    other_info: { 'ui:widget': 'textarea' },
  },
  translation_available: { 'ui:widget': 'text', 'ui:emptyValue': '' },
  united_way_approval: { 'ui:widget': 'radio' },
  additional_information: { 'ui:widget': 'textarea', 'ui:emptyValue': '' },
  demographics_eligible: { 'ui:widget': 'textarea', 'ui:emptyValue': '' },
  hotline: { 'ui:widget': 'radio' },
  safeplace: { 'ui:widget': 'radio' },
};

export default ProviderUiSchema;

import { Resource } from './ResourceModel';
import {
  Ref,
  prop as Property,
  modelOptions,
  getModelForClass,
  DocumentType,
  getName,
} from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { _id: false } })
class TranslationServices {
  @Property({ required: true })
  public always_available!: boolean;
  @Property({ required: true })
  public by_appointment!: boolean;
  @Property({ required: true })
  public over_phone!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class LanguagesAvailable {
  @Property({ required: true })
  public english!: boolean;
  @Property({ required: true })
  public creole!: boolean;
  @Property({ required: true })
  public haitian!: boolean;
  @Property({ required: true })
  public spanish!: boolean;
  @Property({ required: true })
  public others!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class AppointmentScheduling {
  @Property({ required: true })
  public apply_phone!: boolean;
  @Property({ required: true })
  public apply_online!: boolean;
  @Property({ required: true })
  public apply_in_person!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class Appointment {
  @Property({ required: true })
  public is_required!: boolean;
  @Property({ required: true })
  public walk_ins!: boolean;
  @Property({ required: true })
  public appointment_available!: boolean;
  @Property()
  public appointment_scheduling?: AppointmentScheduling;
  @Property()
  public phone?: string;
  @Property()
  public email?: string;
  @Property()
  public url?: string;
  @Property()
  public appointment_details?: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class Application {
  @Property({ required: true })
  public is_required!: boolean;
  @Property()
  public application_details?: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class Ethnicity {
  @Property({ required: true })
  public native_american!: boolean;
  @Property({ required: true })
  public white!: boolean;
  @Property({ required: true })
  public black!: boolean;
  @Property({ required: true })
  public latinx!: boolean;
  @Property({ required: true })
  public middle_eastern!: boolean;
  @Property({ required: true })
  public south_asian!: boolean;
  @Property({ required: true })
  public east_asian!: boolean;
  @Property({ required: true })
  public pacific_islander!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class Gender {
  @Property({ required: true })
  public female!: boolean;
  @Property({ required: true })
  public male!: boolean;
  @Property({ required: true })
  public non_binary!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class HousingStatus {
  @Property({ required: true })
  public homeless!: boolean;
  @Property({ required: true })
  public in_shelter!: boolean;
  @Property({ required: true })
  public rent!: boolean;
  @Property({ required: true })
  public own!: boolean;
  @Property({ required: true })
  public other!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class EducationLevel {
  @Property({ required: true })
  public no_schooling!: boolean;
  @Property({ required: true })
  public kindergarten!: boolean;
  @Property({ required: true })
  public grade_1_11!: boolean;
  @Property({ required: true })
  public grade_12!: boolean;
  @Property({ required: true })
  public high_school_diploma!: boolean;
  @Property({ required: true })
  public ged!: boolean;
  @Property({ required: true })
  public some_college!: boolean;
  @Property({ required: true })
  public vocational_certificate!: boolean;
  @Property({ required: true })
  public associate_degree!: boolean;
  @Property({ required: true })
  public bachelor_degree!: boolean;
  @Property({ required: true })
  public master_degree!: boolean;
  @Property({ required: true })
  public doctorate_degree!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class EmploymentStatus {
  @Property({ required: true })
  public full_time!: boolean;
  @Property({ required: true })
  public part_time!: boolean;
  @Property({ required: true })
  public unemployed!: boolean;
  @Property({ required: true })
  public student!: boolean;
  @Property({ required: true })
  public volunteer!: boolean;
  @Property({ required: true })
  public retired!: boolean;
  @Property({ required: true })
  public homemaker!: boolean;
  @Property({ required: true })
  public self_employed!: boolean;
  @Property({ required: true })
  public unable_to_work!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class EligibilityCriteria {
  @Property()
  public min_age?: number;
  @Property()
  public max_age?: number;
  @Property()
  public min_household_income?: number;
  @Property()
  public max_household_number?: number;
  @Property()
  public employment_status?: EmploymentStatus;
  @Property()
  public education_level?: EducationLevel;
  @Property()
  public housing_status?: HousingStatus;
  @Property({ required: true })
  public gainesville_resident!: boolean;
  @Property({ required: true })
  public alachua_resident!: boolean;
  @Property({ required: true })
  public disability!: boolean;
  @Property({ required: true })
  public veteran!: boolean;
  @Property()
  public gender?: Gender;
  @Property()
  public ethnicity?: Ethnicity;
  @Property()
  public eligibility_details?: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class ServicesType {
  @Property({ required: true })
  public information!: boolean;
  @Property({ required: true })
  public money!: boolean;
  @Property({ required: true })
  public goods!: boolean;
  @Property({ required: true })
  public professional_services!: boolean;
}

class ServicesCost {
  @Property({ required: true })
  public free!: boolean;
  @Property({ required: true })
  public discounted!: boolean;
}

class ServicesOffered {
  @Property()
  public types?: ServicesType;
  @Property()
  public service_cost?: ServicesCost;
  @Property()
  public description?: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class SpecificDate {
  @Property({ required: true })
  public name!: boolean;
  @Property({ required: true })
  public date!: Date;
}

@modelOptions({ schemaOptions: { _id: false } })
class ServicesFrequency {
  @Property({ required: true })
  public weekly!: boolean;
  @Property({ required: true })
  public monthly!: boolean;
  @Property({ required: true })
  public specific_dates!: boolean;
  @Property({ required: true })
  public ad_hoc!: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
class OperatingHours {
  @Property({ required: true })
  public open!: number;
  @Property({ required: true })
  public close!: number;
}

@modelOptions({ schemaOptions: { _id: false } })
class WeekHours {
  @Property()
  public monday?: OperatingHours;
  @Property()
  public tuesday?: OperatingHours;
  @Property()
  public wednesday?: OperatingHours;
  @Property()
  public thursday?: OperatingHours;
  @Property()
  public friday?: OperatingHours;
  @Property()
  public saturday?: OperatingHours;
  @Property()
  public sunday?: OperatingHours;
}

@modelOptions({ schemaOptions: { _id: false } })
class PhoneNumber {
  @Property()
  public name?: string;
  @Property({ required: true })
  public number!: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class Address {
  @Property({ required: true })
  public street_1!: string;
  @Property()
  public street_2?: string;
  @Property({ required: true })
  public city!: string;
  @Property({ required: true })
  public state!: string;
  @Property({ required: true })
  public zipcode!: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class MaintainerContactInfo {
  @Property()
  public name?: string;
  @Property()
  public title?: string;
  @Property()
  public email?: string;
  @Property()
  public phone_?: string;
  @Property()
  public phone_1_notes?: string;
  @Property()
  public phone_2?: string;
  @Property()
  public phone_2_notes?: string;
}

@modelOptions({
  options: { customName: 'Location' },
  schemaOptions: {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function(doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
      },
    },
  },
})
export class Location {
  public readonly id!: string;
  @Property()
  public readonly updated_at!: Date;
  @Property()
  public readonly created_at!: Date;
  @Property({ required: true })
  public name!: string;
  @Property()
  public maintainer_contact_info?: MaintainerContactInfo;
  @Property()
  public address?: Address;
  @Property()
  public phone_number_1?: PhoneNumber;
  @Property()
  public phone_number_2?: PhoneNumber;
  @Property()
  public email?: string;
  @Property()
  public bus_routes?: string;
  @Property()
  public hours?: WeekHours;
  @Property()
  public services_frequency?: ServicesFrequency;
  @Property()
  public weekly_schedule?: string;
  @Property()
  public monthly_schedule?: string;
  @Property()
  public adhoc_schedule?: string;
  @Property()
  public specific_dates?: SpecificDate[];
  @Property()
  public additional_schedule_info?: string;
  @Property()
  public services_offered: ServicesOffered;
  @Property()
  public eligibility_criteria: EligibilityCriteria;
  @Property()
  public application: Application;
  @Property()
  public appointment: Appointment;
  @Property({ required: true })
  public united_way_approved: boolean;
  @Property()
  public languages_available: LanguagesAvailable;
  @Property()
  public translation_services: TranslationServices;
  @Property({ required: true, ref: 'Resource' })
  public resource!: Ref<Resource>;
}

export type LocationType = DocumentType<Location>;

export const LocationModel = getModelForClass(Location);

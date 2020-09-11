import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';
import {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from '../src/category/category.entity';
import { Location, CreateLocationDto } from '../src/location/location.entity';
import { Resource, CreateResourceDto } from '../src/resource/resource.entity';
import { promisify } from 'util';
import fs from 'fs';
import { ObjectId } from 'src/util';

dotenv.config({
    path: path.resolve(process.cwd(), '../../.env'),
});

class PopulateDB {
    // Stores JWT
    accessToken: string;
    // Stores read JSON
    data: any;

    // Stores created categories
    categories: Map<string, Category> = new Map();

    // Stores created resources
    resources: Map<string, Resource> = new Map();
    // Stores created locations
    locations: Map<string, Location> = new Map();

    async populateToken(): Promise<void> {
        const response = await axios.put(
            `http://[::1]:${process.env.PORT}/api/auth/login`,
            {
                email: process.env.MYGNV_EMAIL,
                password: process.env.MYGNV_PASSWORD,
            }
        );
        this.accessToken = response.data.access_token;
        axios.defaults.headers.common['Authorization'] =
            'Bearer ' + this.accessToken;
    }

    async createCategory(
        createCategoryDto: CreateCategoryDto
    ): Promise<Category> {
        try {
            const response = await axios.post(
                `http://[::1]:${process.env.PORT}/api/categories/create`,
                createCategoryDto
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async updateCategory(
        id: string,
        updateCategoryDto: UpdateCategoryDto
    ): Promise<Category> {
        try {
            const response = await axios.post(
                `http://[::1]:${process.env.PORT}/api/categories/update/${id}`,
                updateCategoryDto
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createResource(
        createResourceDto: CreateResourceDto
    ): Promise<Resource> {
        try {
            const response = await axios.post(
                `http://[::1]:${process.env.PORT}/api/resources/create`,
                createResourceDto
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async createLocation(
        createLocationDto: CreateLocationDto
    ): Promise<Location> {
        try {
            const response = await axios.post(
                `http://[::1]:${process.env.PORT}/api/locations/create`,
                createLocationDto
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // HH:MM:SS (AM/PM) -> Seconds since midnight
    static hhmmssToSeconds(str: string): number {
        let timeStamp = str;
        let hours = 0;
        if (timeStamp.includes('PM')) {
            hours = 12;
            timeStamp = timeStamp.substr(0, timeStamp.indexOf('PM'));
        } else if (timeStamp.includes('AM')) {
            timeStamp = timeStamp.substr(0, timeStamp.indexOf('AM'));
        }
        const split = timeStamp.split(':');
        hours += +split[0];
        const minutes = +split[1];
        const seconds = +split[2];

        return hours * 60 * 60 + minutes * 60 + seconds;
    }

    async generateCategories(): Promise<void> {
        for (const index in this.data) {
            const currEntry = this.data[index];
            for (const key in currEntry) {
                const serviceCategory = 'Service Category:';
                if (key.includes(serviceCategory)) {
                    const parentCatName = key
                        .substring(serviceCategory.length)
                        .trim();
                    // If the category doesn't exist yet, create it
                    if (!this.categories.has(parentCatName)) {
                        const newCategory: CreateCategoryDto = {
                            name: parentCatName,
                            icon_name: 'null',
                        };
                        try {
                            this.categories.set(
                                parentCatName,
                                await this.createCategory(newCategory)
                            );
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    // For each child of the category
                    // Create the child and link it to the parent
                    // https://stackoverflow.com/questions/49020531/regex-to-match-only-commas-not-in-parentheses-or-square-brackets
                    const re = /(?!<(?:\(|\[)[^)\]]+),(?![^(\[]+(?:\)|\]))/;
                    const children = currEntry[key]
                        .split(re)
                        .filter((str: string) => str.length !== 0)
                        .map((str: string) => str.trim());
                    for (const childIdx in children) {
                        const child: string = children[childIdx];
                        if (!this.categories.has(child)) {
                            try {
                                // Child not present yet, create
                                const newChildCategory: CreateCategoryDto = {
                                    name: child,
                                    icon_name: 'null',
                                    parents: [
                                        this.categories.get(parentCatName).id,
                                    ],
                                };
                                this.categories.set(
                                    child,
                                    await this.createCategory(newChildCategory)
                                );
                            } catch (error) {
                                console.log(error);
                            }
                        } else {
                            try {
                                // The child is already present, update
                                const currChild = this.categories.get(child);
                                currChild.parents.push(
                                    (this.categories.get(parentCatName)
                                        .id as unknown) as ObjectId
                                );
                                this.categories.set(
                                    child,
                                    await this.updateCategory(currChild.id, {
                                        parents: (currChild.parents as unknown) as string[],
                                    })
                                );
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }
            }
        }
    }

    async generateResources(): Promise<void> {
        for (const index in this.data) {
            const currEntry = this.data[index];

            // Link resource to categories
            const categoriesSet: Set<string> = new Set();
            for (const key in currEntry) {
                const serviceCategory = 'Service Category:';
                if (key.includes(serviceCategory)) {
                    // https://stackoverflow.com/questions/49020531/regex-to-match-only-commas-not-in-parentheses-or-square-brackets
                    const re = /(?!<(?:\(|\[)[^)\]]+),(?![^(\[]+(?:\)|\]))/;
                    const children = currEntry[key]
                        .split(re)
                        .filter((str: string) => str.length !== 0)
                        .map((str: string) => str.trim());
                    for (const childIdx in children) {
                        const child: string = children[childIdx];
                        if (this.categories.has(child))
                            categoriesSet.add(this.categories.get(child).id);
                    }
                }
            }

            const newResource: CreateResourceDto = {
                name: currEntry['Name of Organization'],
                organization_description:
                    currEntry[
                        'Short Description of Organization (250 Characters)'
                    ],
                organization_url: currEntry['Organization Website URL'],
                maintainer_contact_info: {
                    name: currEntry['Contact Name for Organization'],
                    title: currEntry['Contact Title for Organization'],
                    email: currEntry['Contact Email for Organization'],
                    phone_1: currEntry['Contact Phone 1 for Organization'],
                    phone_1_notes:
                        currEntry['Contact Info 1 Notes for Organization'],
                    phone_2: currEntry['Contact Phone 2 for Organization'],
                    phone_2_notes:
                        currEntry['Contact Info 2 Notes for Organization'],
                },
                categories: [...categoriesSet],
            };

            let createdResource: Resource;
            try {
                createdResource = await this.createResource(newResource);
                this.resources.set(newResource.name, createdResource);
            } catch (error) {
                console.log(error);
            }

            // Create the new location and link to resource
            const newLocation: CreateLocationDto = {
                name: currEntry['Location Name']
                    ? currEntry['Location Name']
                    : currEntry['Name of Organization'],
                maintainer_contact_info: {
                    name: currEntry['Contact Name for Location']
                        ? currEntry['Contact Name for Location']
                        : currEntry['Contact Name for Organization'],
                    title: currEntry['Contact Title for Location']
                        ? currEntry['Contact Title for Location']
                        : currEntry['Contact Title for Organization'],
                    email: currEntry['Contact Email for Location']
                        ? currEntry['Contact Email for Location']
                        : currEntry['Contact Email for Organization'],
                    phone_1: currEntry['Contact Phone 1 for Location']
                        ? currEntry['Contact Phone 1 for Location']
                        : currEntry['Contact Phone 1 for Organization'],
                    phone_1_notes: currEntry[
                        'Contact Info 1 Notes for Location'
                    ]
                        ? currEntry['Contact Info 1 Notes for Location']
                        : currEntry['Contact Info 1 Notes for Organization'],
                    phone_2: currEntry['Contact Phone 2 for Location']
                        ? currEntry['Contact Phone 2 for Location']
                        : currEntry['Contact Phone 2 for Organization'],
                    phone_2_notes: currEntry[
                        'Contact Info 2 Notes for Location'
                    ]
                        ? currEntry['Contact Info 2 Notes for Location']
                        : currEntry['Contact Info 2 Notes for Organization'],
                },
                address: currEntry['Location Address 1']
                    ? {
                          street_1: currEntry['Location Address 1'],
                          street_2: currEntry['Location Address 2'],
                          city: currEntry['City'],
                          state: 'Florida',
                          zipcode: currEntry['Zip Code'],
                      }
                    : undefined,
                phone_number_1: currEntry['Location Phone Number 1']
                    ? {
                          name:
                              currEntry[
                                  'Location Phone Number 1 Name (ex: Main, office hours)'
                              ],
                          number: currEntry['Location Phone Number 1'],
                      }
                    : undefined,
                phone_number_2: currEntry['Location Phone Number 2']
                    ? {
                          name:
                              currEntry[
                                  'Location Phone Number 2 Name (ex: Main, office hours)'
                              ],
                          number: currEntry['Location Phone Number 2'],
                      }
                    : undefined,
                email: currEntry['Location Email']
                    ? currEntry['Location Email']
                    : undefined,
                bus_routes: currEntry['Bus Routes']
                    ? currEntry['Bus Routes']
                    : undefined,
                hours: {
                    monday: currEntry['Monday Start Time']
                        ? {
                              open: PopulateDB.hhmmssToSeconds(
                                  currEntry['Monday Start Time']
                              ),
                              close: PopulateDB.hhmmssToSeconds(
                                  currEntry['Monday End Time']
                              ),
                          }
                        : undefined,
                    tuesday: currEntry['Tuesday Start Time']
                        ? {
                              open: PopulateDB.hhmmssToSeconds(
                                  currEntry['Tuesday Start Time']
                              ),
                              close: PopulateDB.hhmmssToSeconds(
                                  currEntry['Tuesday End Time']
                              ),
                          }
                        : undefined,
                    wednesday: currEntry['Wednesday Start Time']
                        ? {
                              open: PopulateDB.hhmmssToSeconds(
                                  currEntry['Wednesday Start Time']
                              ),
                              close: PopulateDB.hhmmssToSeconds(
                                  currEntry['Wednesday End Time']
                              ),
                          }
                        : undefined,
                    thursday: currEntry['Thursday Start Time']
                        ? {
                              open: PopulateDB.hhmmssToSeconds(
                                  currEntry['Thursday Start Time']
                              ),
                              close: PopulateDB.hhmmssToSeconds(
                                  currEntry['Thursday End Time']
                              ),
                          }
                        : undefined,
                    friday: currEntry['Friday Start Time']
                        ? {
                              open: PopulateDB.hhmmssToSeconds(
                                  currEntry['Friday Start Time']
                              ),
                              close: PopulateDB.hhmmssToSeconds(
                                  currEntry['Friday End Time']
                              ),
                          }
                        : undefined,
                    saturday: currEntry['Saturday Start Time']
                        ? {
                              open: PopulateDB.hhmmssToSeconds(
                                  currEntry['Saturday Start Time']
                              ),
                              close: PopulateDB.hhmmssToSeconds(
                                  currEntry['Saturday End Time']
                              ),
                          }
                        : undefined,
                    sunday: currEntry['Sunday Start Time']
                        ? {
                              open: PopulateDB.hhmmssToSeconds(
                                  currEntry['Sunday Start Time']
                              ),
                              close: PopulateDB.hhmmssToSeconds(
                                  currEntry['Sunday End Time']
                              ),
                          }
                        : undefined,
                },
                services_frequency: {
                    weekly: currEntry['Frequency of Services'].includes(
                        'Weekly'
                    ),
                    monthly: currEntry['Frequency of Services'].includes(
                        'Monthly'
                    ),
                    specific_dates: currEntry['Frequency of Services'].includes(
                        'Specific Dates'
                    ),
                    ad_hoc: currEntry['Frequency of Services'].includes(
                        'Ad-hoc'
                    ),
                },
                weekly_schedule: currEntry['Weekly Schedule']
                    ? currEntry['Weekly Schedule']
                    : undefined,
                monthly_schedule: currEntry[
                    'Monthly Schedule (ex: third Thursday at 5pm)'
                ]
                    ? currEntry['Monthly Schedule (ex: third Thursday at 5pm)']
                    : undefined,
                adhoc_schedule: currEntry[
                    'Ad-hoc Schedule (ex: Home Football Games)'
                ]
                    ? currEntry['Ad-hoc Schedule (ex: Home Football Games)']
                    : undefined,
                // NOTE: Not parsing specific_dates field at this time.
                additional_schedule_info: currEntry[
                    'Additional Schedule Information (ex: for Catholic Charities and others to put their lunch hours, etc.)'
                ]
                    ? currEntry[
                          'Additional Schedule Information (ex: for Catholic Charities and others to put their lunch hours, etc.)'
                      ]
                    : undefined,
                services_offered: {
                    types: {
                        information: currEntry['Service Types'].includes(
                            'Information (i.e. referrals, educational materials)'
                        ),
                        money: currEntry['Service Types'].includes(
                            'Money (i.e. rent payment assistance, transportation vouchers)'
                        ),
                        goods: currEntry['Service Types'].includes(
                            'Goods (i.e. food, medication)'
                        ),
                        professional_services: currEntry[
                            'Service Types'
                        ].includes(
                            'Professional Services (i.e. medical appointments, legal counseling)'
                        ),
                    },
                    service_cost: {
                        free: currEntry['Service Cost'].includes('Free'),
                        discounted: currEntry['Service Cost'].includes(
                            'Discounted'
                        ),
                    },
                    description: currEntry[
                        'Service Description (Briefly describe services or programs offered)'
                    ]
                        ? currEntry[
                              'Service Description (Briefly describe services or programs offered)'
                          ]
                        : undefined,
                },
                eligibility_criteria: {
                    min_age: currEntry['Minimum Age'],
                    max_age: currEntry['Maximum Age'],
                    min_household_income:
                        currEntry['Minimum Annual Household Income'],
                    max_household_income:
                        currEntry['Maximum Annual Household Income'],
                    employment_status: currEntry['Employment Status']
                        ? {
                              full_time: currEntry[
                                  'Employment Status'
                              ].includes('Employed full time'),
                              part_time: currEntry[
                                  'Employment Status'
                              ].includes('Employed part time'),
                              unemployed: currEntry[
                                  'Employment Status'
                              ].includes('Unemployed'),
                              student: currEntry['Employment Status'].includes(
                                  'Student'
                              ),
                              volunteer: currEntry[
                                  'Employment Status'
                              ].includes('Volunteer'),
                              retired: currEntry['Employment Status'].includes(
                                  'Retired'
                              ),
                              homemaker: currEntry[
                                  'Employment Status'
                              ].includes('Homemaker'),
                              self_employed: currEntry[
                                  'Employment Status'
                              ].includes('Self-employed'),
                              unable_to_work: currEntry[
                                  'Employment Status'
                              ].includes('Unable to work'),
                          }
                        : undefined,
                    education_level: currEntry['Education Achieved']
                        ? {
                              no_schooling: currEntry[
                                  'Education Achieved'
                              ].includes('No Schooling'),
                              kindergarten: currEntry[
                                  'Education Achieved'
                              ].includes('Kindergarten'),
                              grade_1_11: currEntry[
                                  'Education Achieved'
                              ].includes('Grades 1-11'),
                              grade_12: currEntry[
                                  'Education Achieved'
                              ].includes('12th Grade (No Diploma)'),
                              high_school_diploma: currEntry[
                                  'Education Achieved'
                              ].includes('Regular High School Diploma'),
                              ged: currEntry['Education Achieved'].includes(
                                  'GED or alternative credential'
                              ),
                              some_college: currEntry[
                                  'Education Achieved'
                              ].includes('Some college credit'),
                              vocational_certificate: currEntry[
                                  'Education Achieved'
                              ].includes('Vocational Certificate'),
                              associate_degree: currEntry[
                                  'Education Achieved'
                              ].includes('Associate’s Degree'),
                              bachelor_degree: currEntry[
                                  'Education Achieved'
                              ].includes('Bachelor’s Degree'),
                              master_degree: currEntry[
                                  'Education Achieved'
                              ].includes('Master’s Degree'),
                              doctorate_degree: currEntry[
                                  'Education Achieved'
                              ].includes('Doctorate Degree'),
                          }
                        : undefined,
                    housing_status: currEntry['Housing Status']
                        ? {
                              homeless: currEntry['Housing Status'].includes(
                                  'Homeless'
                              ),
                              in_shelter: currEntry['Housing Status'].includes(
                                  'In Shelter'
                              ),
                              rent: currEntry['Housing Status'].includes(
                                  'Rent'
                              ),
                              own: currEntry['Housing Status'].includes('Own'),
                              other: currEntry['Housing Status'].includes(
                                  'Other'
                              ),
                          }
                        : undefined,
                    gainesville_resident: currEntry['Residency'].includes(
                        'City of Gainesville'
                    ),
                    alachua_resident: currEntry['Residency'].includes(
                        'Alachua County'
                    ),
                    // NOTE: Hardcoding these two values since they were not in the google form
                    disability: false,
                    veteran: false,
                    gender: currEntry['Gender']
                        ? {
                              female: currEntry['Gender'].includes('Female'),
                              male: currEntry['Gender'].includes('Male'),
                              non_binary: currEntry['Gender'].includes(
                                  'Non-Binary'
                              ),
                          }
                        : undefined,
                    ethnicity: currEntry['Ethnicity']
                        ? {
                              native_american: currEntry['Ethnicity'].includes(
                                  'Native American or Alaskan Native'
                              ),
                              white: currEntry['Ethnicity'].includes(
                                  'White or Euro-American'
                              ),
                              black: currEntry['Ethnicity'].includes(
                                  'Black, Afro-Caribbean, or African American'
                              ),
                              latinx: currEntry['Ethnicity'].includes(
                                  'Latinx or Hispanic American'
                              ),
                              middle_eastern: currEntry['Ethnicity'].includes(
                                  'Middle Eastern or Arab American'
                              ),
                              south_asian: currEntry['Ethnicity'].includes(
                                  'South Asian or South Asian American'
                              ),
                              east_asian: currEntry['Ethnicity'].includes(
                                  'East Asian, South East Asian or Asian American'
                              ),
                              pacific_islander: currEntry['Ethnicity'].includes(
                                  'Native Hawaiian, Other Pacific Islander or Pacific Islander American'
                              ),
                          }
                        : undefined,
                    eligibility_details: currEntry['Eligibility Details']
                        ? currEntry['Eligibility Details']
                        : undefined,
                },
                application: {
                    is_required: currEntry['Application Required?'].includes(
                        'Yes'
                    ),
                    application_details: currEntry['Application Information']
                        ? currEntry['Application Information']
                        : undefined,
                },
                appointment: {
                    is_required: currEntry['Appointments Required?'].includes(
                        'Yes'
                    ),
                    walk_ins: currEntry['Walk-ins Allowed?'].includes('Yes'),
                    appointment_available: currEntry[
                        'Appointments Available?'
                    ].includes('Yes'),
                    appointment_scheduling: {
                        apply_phone: currEntry[
                            'Appointment Scheduling'
                        ].includes('By phone'),
                        apply_online: currEntry[
                            'Appointment Scheduling'
                        ].includes('On website'),
                        apply_in_person: currEntry[
                            'Appointment Scheduling'
                        ].includes('In-person at the office'),
                    },
                    phone: currEntry['Appointment Phone Number']
                        ? currEntry['Appointment Phone Number']
                        : undefined,
                    email: currEntry['Appointment Email address']
                        ? currEntry['Appointment Email address']
                        : undefined,
                    url: currEntry['Appointment URL']
                        ? currEntry['Appointment URL']
                        : undefined,
                    // NOTE: Not parsing appointment_details field at this time.
                },
                united_way_approved: currEntry['United Way Approved?'].includes(
                    'Yes'
                ),
                languages_available: currEntry['Languages Available']
                    ? {
                          english: currEntry['Languages Available'].includes(
                              'English'
                          ),
                          creole: currEntry['Languages Available'].includes(
                              'Creole'
                          ),
                          haitian: currEntry['Languages Available'].includes(
                              'Haitian'
                          ),
                          spanish: currEntry['Languages Available'].includes(
                              'Spanish'
                          ),
                          others: currEntry['Languages Available'].includes(
                              'Others Upon Request'
                          ),
                      }
                    : undefined,
                translation_services: currEntry['Translation Services']
                    ? {
                          always_available: currEntry[
                              'Translation Services'
                          ].includes('Always Available'),
                          by_appointment: currEntry[
                              'Translation Services'
                          ].includes('By Appointment Only'),
                          over_phone: currEntry[
                              'Translation Services'
                          ].includes('Over Phone'),
                      }
                    : undefined,
                resource: createdResource?.id,
            };

            try {
                this.locations.set(
                    newLocation.name,
                    await this.createLocation(newLocation)
                );
            } catch (error) {
                console.log(error);
            }
        }
    }

    async populateFile(filename: string): Promise<void> {
        const asyncFileRead = promisify(fs.readFile);
        this.data = JSON.parse(await asyncFileRead(filename, 'utf8'));
    }
}

const main = async () => {
    const popDB = new PopulateDB();
    await popDB.populateToken();
    await popDB.populateFile('./data.json');
    await popDB.generateCategories();
    await popDB.generateResources();
    console.log(popDB.categories);
    console.log(popDB.resources);
    console.log(popDB.locations);
};

main();

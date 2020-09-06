import {
    Injectable,
    UnauthorizedException,
    HttpException,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Resource } from '../resource/resource.entity';
import {
    Location,
    LocationType,
    CreateLocationDto,
    UpdateLocationDto,
} from './location.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { Role, User } from '../user/user.entity';
import { QueryPopulateOptions } from 'mongoose';
import { ObjectId } from '../util';
import { Category } from '../category/category.entity';

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(Location)
        private LocationModel: ReturnModelType<typeof Location>,
        @InjectModel(Resource)
        private ResourceModel: ReturnModelType<typeof Resource>,
        @InjectModel(Category)
        private CategoryModel: ReturnModelType<typeof Category>
    ) {}

    private queryPopulateOptions(
        resource: string,
        user: User
    ): QueryPopulateOptions[] {
        let populateOptions = [];
        if (resource?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'resource'];
        let select = '';
        // Ignore private data when populating
        if (user?.role !== Role.OWNER) {
            select = '-maintainer_contact_info';
        }
        return populateOptions.map((path) => {
            const option: QueryPopulateOptions = { path, select };
            return option;
        });
    }

    async list(
        resource: string,
        filter: object,
        user: User
    ): Promise<Location[]> {
        filter = filter ? filter : {};
        const locationList = await this.LocationModel.find(filter).populate(
            this.queryPopulateOptions(resource, user)
        );
        if (user.role !== Role.OWNER) {
            return locationList.map((location) => {
                delete location.maintainer_contact_info;
                return location;
            });
        } else return locationList;
    }

    async read(id: string, resource: string, user: User): Promise<Location> {
        const location = (await this.LocationModel.findById(id)).populate(
            this.queryPopulateOptions(resource, user)
        );
        if (user.role !== Role.OWNER) {
            delete location.maintainer_contact_info;
        }
        return location;
    }

    async create(
        createLocationDto: CreateLocationDto,
        user: User
    ): Promise<Location> {
        if (user?.role !== Role.OWNER)
            throw new UnauthorizedException('Unauthorized');
        try {
            const location = new this.LocationModel(createLocationDto);
            const newResource = location.resource;
            location.resource = null;

            await location.save();
            this.updateLocationResourceBinding(
                location,
                newResource as ObjectId
            );
            await location.save();
            return location;
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    async update(
        id: string,
        updateLocationDto: UpdateLocationDto,
        user: User
    ): Promise<Location> {
        const location = await this.isLocationUpdateAllowed(id, user);

        try {
            const newLocation = new this.LocationModel(updateLocationDto);

            for (const key in newLocation) {
                if (
                    Object.prototype.hasOwnProperty.call(newLocation, key) &&
                    location[key] !== newLocation[key] &&
                    key !== 'updated_at' &&
                    key !== 'created_at' &&
                    key !== '_id' &&
                    key !== '__v' &&
                    key !== 'resource'
                ) {
                    location[key] = newLocation[key];
                }
            }

            await location.save();

            if (newLocation.resource) {
                this.updateLocationResourceBinding(
                    location,
                    newLocation.resource as ObjectId
                );
            }

            await location.save();
            return location;
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    async delete(id: string, user: User): Promise<void> {
        if (user?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);
        try {
            const location = await this.LocationModel.findById(id);
            this.updateLocationResourceBinding(location, null);

            await location.deleteOne();
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    async updateLocationResourceBinding(
        location: LocationType,
        newResource: ObjectId
    ): Promise<void> {
        if (location.resource === newResource) return;

        const oldResource = location.resource;

        if (newResource) {
            const parentResource = await this.ResourceModel.findById(
                newResource
            );
            const locationsSet = new Set(parentResource.locations);
            locationsSet.add(location._id);
            parentResource.locations = [...locationsSet];
            await parentResource.save();
        }

        if (oldResource) {
            const parentResource = await this.ResourceModel.findById(
                oldResource
            );
            const locationsSet = new Set(parentResource.locations);
            if (locationsSet.has(location._id)) {
                locationsSet.delete(location._id);
                parentResource.locations = [...locationsSet];
                await parentResource.save();
            }
        }

        location.resource = newResource;
    }

    async isLocationUpdateAllowed(
        id: string,
        user: User
    ): Promise<LocationType> {
        try {
            const locationToEdit = await this.LocationModel.findById(id);
            if (user.role === Role.OWNER) return locationToEdit;

            const categories = await this.CategoryModel.find({});
            const locations = await this.LocationModel.find({});
            const resources = await this.ResourceModel.find({});
            const allowedLocations: LocationType[] = [];
            const categoryMap = new Map(
                Object.values(categories).map((category) => [
                    category._id as ObjectId,
                    category,
                ])
            );
            const locationMap = new Map(
                Object.values(locations).map((location) => [
                    location._id as ObjectId,
                    location,
                ])
            );
            const resourceMap = new Map(
                Object.values(resources).map((resource) => [
                    resource._id as ObjectId,
                    resource,
                ])
            );
            if (user.role === Role.EDITOR) {
                user.location_can_edit.forEach((id: ObjectId) => {
                    if (!locationMap.has(id)) return;
                    allowedLocations.push(locationMap.get(id));
                });

                // for each resource in resource_can_edit, get all locations and stick in array
                user.resource_can_edit.forEach((id: ObjectId) => {
                    if (!resourceMap.has(id)) return;
                    allowedLocations.push(
                        ...resourceMap
                            .get(id)
                            .locations.filter((id: ObjectId) =>
                                locationMap.has(id)
                            )
                            .map((id: ObjectId) => {
                                return locationMap.get(id);
                            })
                    );
                });
            }

            // for each category in cat_can_edit_resource_in, get all locations and stick in array
            user.cat_can_edit_members.forEach((id: ObjectId) => {
                if (!categoryMap.has(id)) return;
                allowedLocations.concat(
                    ...categoryMap
                        .get(id)
                        .resources.filter((id: ObjectId) => resourceMap.has(id))
                        .map((id: ObjectId) => {
                            return resourceMap
                                .get(id)
                                .locations.map((id: ObjectId) =>
                                    locationMap.get(id)
                                );
                        })
                );
            });

            if (
                allowedLocations.filter(
                    (location) => location._id === locationToEdit._id
                ).length > 0
            ) {
                return locationToEdit;
            } else {
                throw new UnauthorizedException('Unauthorized');
            }
        } catch (error) {
            throw error;
        }
    }
}

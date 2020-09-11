import {
    Injectable,
    HttpException,
    UnauthorizedException,
} from '@nestjs/common';
import {
    Resource,
    CreateResourceDto,
    ResourceType,
    UpdateResourceDto,
} from './resource.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { User, Role } from '../user/user.entity';
import { QueryPopulateOptions } from 'mongoose';
import {
    ObjectId,
    getAddedRemoved,
    toObjectIdArray,
    toStringArray,
} from '../util';
import { Location } from '../location/location.entity';
import { Category } from '../category/category.entity';

@Injectable()
export class ResourceService {
    constructor(
        @InjectModel(Resource)
        private ResourceModel: ReturnModelType<typeof Resource>,
        @InjectModel(Category)
        private CategoryModel: ReturnModelType<typeof Category>,
        @InjectModel(Location)
        private LocationModel: ReturnModelType<typeof Location>
    ) {}

    private queryPopulateOptions(
        locations: string,
        categories: string,
        user: User
    ): QueryPopulateOptions[] {
        let populateOptions = [];
        if (locations?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'locations'];
        if (categories?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'categories'];
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
        locations: string,
        categories: string,
        filter: object,
        user: User
    ): Promise<Resource[]> {
        filter = filter ? filter : {};
        const resourceList = await this.ResourceModel.find(filter).populate(
            this.queryPopulateOptions(locations, categories, user)
        );
        if (user?.role !== Role.OWNER) {
            return resourceList.map((resource) => {
                resource.maintainer_contact_info = undefined;
                return resource;
            });
        } else return resourceList;
    }

    async read(
        id: string,
        locations: string,
        categories: string,
        user: User
    ): Promise<Resource> {
        const resource = (await this.ResourceModel.findById(id)).populate(
            this.queryPopulateOptions(locations, categories, user)
        );
        if (user.role !== Role.OWNER) {
            resource.maintainer_contact_info = undefined;
        }
        return resource;
    }

    async create(
        createResourceDto: CreateResourceDto,
        user: User
    ): Promise<Resource> {
        if (user?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);
        try {
            const resource: ResourceType = new this.ResourceModel(
                createResourceDto
            );
            const newLocations = resource.locations;
            const newCategories = resource.categories;
            resource.locations = [];
            resource.categories = [];

            await resource.save();

            this.updateResourceLocationsBinding(
                resource,
                toStringArray(newLocations as ObjectId[])
            );
            this.updateResourceCategoriesBinding(
                resource,
                toStringArray(newCategories as ObjectId[])
            );

            await resource.save();
            return resource;
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    async update(
        id: string,
        updateResourceDto: UpdateResourceDto,
        user: User
    ): Promise<Resource> {
        const resource = await this.isResourceUpdateAllowed(id, user);

        try {
            const newResource = new this.ResourceModel(updateResourceDto);

            for (const key in newResource) {
                if (
                    Object.prototype.hasOwnProperty.call(newResource, key) &&
                    resource[key] !== newResource[key] &&
                    key !== 'updated_at' &&
                    key !== 'created_at' &&
                    key !== '_id' &&
                    key !== '__v' &&
                    key !== 'locations' &&
                    key !== 'categories'
                ) {
                    resource[key] = newResource[key];
                }
            }

            await resource.save();

            if (newResource.locations) {
                this.updateResourceLocationsBinding(
                    resource,
                    toStringArray(newResource.locations as ObjectId[])
                );
            }
            if (newResource.categories) {
                this.updateResourceCategoriesBinding(
                    resource,
                    toStringArray(newResource.categories as ObjectId[])
                );
            }

            await resource.save();

            return resource;
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    async delete(id: string, user: User): Promise<void> {
        if (user?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);
        try {
            const resource = await this.ResourceModel.findById(id);
            this.updateResourceLocationsBinding(resource, []);
            this.updateResourceCategoriesBinding(resource, []);

            await resource.deleteOne();
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    private async updateResourceLocationsBinding(
        resource: ResourceType,
        newLocations: string[]
    ): Promise<void> {
        // If it's a added location, link the location's binding to this resource.
        // If it's a removed location, unlink the location's binding to this resource.

        const oldLocations = toStringArray(resource.locations as ObjectId[]);

        const {
            added: addedLocations,
            removed: removedLocations,
        } = getAddedRemoved(newLocations, oldLocations);

        addedLocations.map(async (addedLocation) => {
            const location = await this.LocationModel.findById(addedLocation);
            location.resource = resource._id;
            await location.save();
        });

        removedLocations.map(async (removedLocation) => {
            const location = await this.LocationModel.findById(removedLocation);
            if ((location.resource as ObjectId).toHexString() === resource.id) {
                location.resource = undefined;
                await location.save();
            }
        });

        resource.locations = toObjectIdArray(newLocations);
    }

    private async updateResourceCategoriesBinding(
        resource: ResourceType,
        newCategories: string[]
    ): Promise<void> {
        // If it's a added category, link the category's binding to this resource.
        // If it's a removed category, unlink the category's binding to this resource.

        const oldCategories = toStringArray(resource.categories as ObjectId[]);

        const {
            added: addedCategories,
            removed: removedCategories,
        } = getAddedRemoved(newCategories, oldCategories);

        addedCategories.map(async (addedCategory) => {
            const category = await this.CategoryModel.findById(addedCategory);
            const resourcesSet = new Set(
                toStringArray(category.resources as ObjectId[])
            );
            resourcesSet.add(resource.id);
            category.resources = toObjectIdArray([...resourcesSet]);
            await category.save();
        });

        removedCategories.map(async (removedCategory) => {
            const category = await this.CategoryModel.findById(removedCategory);
            const resourcesSet = new Set(
                toStringArray(category.resources as ObjectId[])
            );
            if (resourcesSet.has(resource.id)) {
                resourcesSet.delete(resource.id);
                category.resources = toObjectIdArray([...resourcesSet]);
                await category.save();
            }
        });

        resource.categories = toObjectIdArray(newCategories);
    }

    private async isResourceUpdateAllowed(
        id: string,
        user: User
    ): Promise<ResourceType> {
        try {
            const resourceToEdit = await this.ResourceModel.findById(id);
            if (user.role === Role.OWNER) return resourceToEdit;

            const resources = await this.ResourceModel.find({});
            const categories = await this.CategoryModel.find({});
            const allowedResources: ResourceType[] = [];
            const categoryMap = new Map(
                Object.values(categories).map((category) => [
                    category._id as ObjectId,
                    category,
                ])
            );
            const resourceMap = new Map(
                Object.values(resources).map((resource) => [
                    resource._id as ObjectId,
                    resource,
                ])
            );
            if (user.role === Role.EDITOR) {
                user.resource_can_edit.forEach((id: ObjectId) => {
                    if (!resourceMap.has(id)) return;
                    allowedResources.push(resourceMap.get(id));
                });

                // for each category in cat_can_edit_resource_in, get all resources and stick in array
                user.cat_can_edit_members.forEach((id: ObjectId) => {
                    if (!categoryMap.has(id)) return;
                    allowedResources.push(
                        ...categoryMap
                            .get(id)
                            .resources.filter((id: ObjectId) =>
                                resourceMap.has(id)
                            )
                            .map((id: ObjectId) => {
                                return resourceMap.get(id);
                            })
                    );
                });
            }

            if (
                allowedResources.filter(
                    (resource) => resource._id === resourceToEdit._id
                ).length > 0
            ) {
                return resourceToEdit;
            } else {
                throw new UnauthorizedException('Unauthorized');
            }
        } catch (error) {
            throw error;
        }
    }
}

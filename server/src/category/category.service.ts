import { Injectable, HttpException } from '@nestjs/common';
import {
    Category,
    CreateCategoryDto,
    CategoryType,
    UpdateCategoryDto,
} from './category.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { User, Role } from '../user/user.entity';
import { QueryPopulateOptions } from 'mongoose';
import { Resource } from '../resource/resource.entity';
import { getAddedRemoved, ObjectId } from '../util';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category)
        private readonly CategoryModel: ReturnModelType<typeof Category>,
        @InjectModel(Resource)
        private readonly ResourceModel: ReturnModelType<typeof Resource>
    ) {}

    private queryPopulateOptions(
        children: string,
        parents: string,
        resources: string,
        user: User
    ): QueryPopulateOptions[] {
        let populateOptions = [];
        if (children?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'children'];
        if (parents?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'parents'];
        if (resources?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'resources'];
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
        children: string,
        parents: string,
        resources: string,
        filter: object,
        user: User
    ) {
        filter = filter ? filter : {};
        return await this.CategoryModel.find(filter).populate(
            this.queryPopulateOptions(children, parents, resources, user)
        );
    }

    async listTopLevel(
        children: string,
        parents: string,
        resources: string,
        user: User
    ) {
        return this.list(
            children,
            parents,
            resources,
            { parents: { $size: 0 } },
            user
        );
    }

    async read(
        id: string,
        children: string,
        parents: string,
        resources: string,
        user: User
    ) {
        return (await this.CategoryModel.findById(id)).populate(
            this.queryPopulateOptions(children, parents, resources, user)
        );
    }

    async create(
        createCategoryDto: CreateCategoryDto,
        user: User
    ): Promise<Category> {
        if (user?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);
        try {
            const category: CategoryType = new this.CategoryModel(
                createCategoryDto
            );
            const newResources = category.resources;
            const newChildren = category.children;
            const newParents = category.parents;
            category.resources = [];
            category.children = [];
            category.parents = [];

            await category.save();
            this.updateCategoryResourcesBinding(
                category,
                newResources as ObjectId[]
            );
            this.updateCategoryChildrenBinding(
                category,
                newChildren as ObjectId[]
            );
            this.updateCategoryParentsBinding(
                category,
                newParents as ObjectId[]
            );
            await category.save();
            return category;
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    async update(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
        user: User
    ): Promise<Category> {
        if (user?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);
        try {
            const category = await this.CategoryModel.findById(id);
            const newCategory = new this.CategoryModel(updateCategoryDto);

            if (newCategory.name) {
                category.name = newCategory.name;
            }
            if (newCategory.icon_name) {
                category.icon_name = newCategory.icon_name;
            }

            await category.save();

            if (newCategory.resources) {
                this.updateCategoryResourcesBinding(
                    category,
                    newCategory.resources as ObjectId[]
                );
            }
            if (newCategory.children) {
                this.updateCategoryChildrenBinding(
                    category,
                    newCategory.children as ObjectId[]
                );
            }
            if (newCategory.parents) {
                this.updateCategoryParentsBinding(
                    category,
                    newCategory.parents as ObjectId[]
                );
            }

            await category.save();

            return category;
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    async delete(id: string, user: User): Promise<void> {
        if (user?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);
        try {
            const category = await this.CategoryModel.findById(id);
            this.updateCategoryResourcesBinding(category, []);
            this.updateCategoryChildrenBinding(category, []);
            this.updateCategoryParentsBinding(category, []);

            await category.deleteOne();
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    private async updateCategoryResourcesBinding(
        category: CategoryType,
        newResources: ObjectId[]
    ): Promise<void> {
        // If it's a added resource, link the resource's binding to this category.
        // If it's a removed resource, unlink the resource's binding to this category.

        if (category.resources === newResources) return;

        const {
            added: addedResources,
            removed: removedResources,
        } = getAddedRemoved(newResources, category.resources as ObjectId[]);

        addedResources.map(async (addedResource) => {
            const resource = await this.ResourceModel.findById(addedResource);
            const categoriesSet = new Set(resource.categories);
            categoriesSet.add(category.id);
            resource.categories = [...categoriesSet];
            await resource.save();
        });

        removedResources.map(async (removedResource) => {
            const resource = await this.ResourceModel.findById(removedResource);
            const categoriesSet = new Set(resource.categories);
            if (categoriesSet.has(category.id)) {
                categoriesSet.delete(category.id);
                resource.categories = [...categoriesSet];
                await resource.save();
            }
        });

        category.resources = newResources;
    }

    private async updateCategoryChildrenBinding(
        category: CategoryType,
        newChildren: ObjectId[]
    ): Promise<void> {
        if (category.children === newChildren) return;

        // If it's a added child, link the child's binding to this category.
        // If it's a removed child, unlink the child's binding to this category.
        const {
            added: addedChildren,
            removed: removedChildren,
        } = getAddedRemoved(newChildren, category.children as ObjectId[]);

        addedChildren.map(async (addedChild) => {
            const childCategory = await this.CategoryModel.findById(addedChild);
            const parentsSet = new Set(childCategory.parents);
            parentsSet.add(category.id);
            childCategory.parents = [...parentsSet];
            await childCategory.save();
        });

        removedChildren.map(async (removedChild) => {
            const childCategory = await this.CategoryModel.findById(
                removedChild
            );
            const parentsSet = new Set(childCategory.parents);
            if (parentsSet.has(category.id)) {
                parentsSet.delete(category.id);
                childCategory.parents = [...parentsSet];
                await childCategory.save();
            }
        });

        category.children = newChildren;
    }

    private async updateCategoryParentsBinding(
        category: CategoryType,
        newParents: ObjectId[]
    ): Promise<void> {
        if (category.parents === newParents) return;

        // If it's a added child, link the child's binding to this category.
        // If it's a removed child, unlink the child's binding to this category.
        const {
            added: addedParents,
            removed: removedParents,
        } = getAddedRemoved(newParents, category.parents as ObjectId[]);

        addedParents.map(async (addedParent) => {
            const parentCategory = await this.CategoryModel.findById(
                addedParent
            );
            const childrenSet = new Set(parentCategory.parents);
            childrenSet.add(category.id);
            parentCategory.parents = [...childrenSet];
            await parentCategory.save();
        });

        removedParents.map(async (removedParent) => {
            const parentCategory = await this.CategoryModel.findById(
                removedParent
            );
            const childrenSet = new Set(parentCategory.children);
            if (childrenSet.has(category.id)) {
                childrenSet.delete(category.id);
                parentCategory.children = [...childrenSet];
                await parentCategory.save();
            }
        });

        category.parents = newParents;
    }
}

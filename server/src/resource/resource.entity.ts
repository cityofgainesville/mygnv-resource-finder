import { Category } from '../category/category.entity';
import { Location } from '../location/location.entity';
import {
    Ref,
    prop as Property,
    modelOptions,
    DocumentType,
} from '@typegoose/typegoose';
import { TypegooseModule } from 'nestjs-typegoose';
import { DynamicModule } from '@nestjs/common';

export class CreateResourceDto {
    public name!: string;
    public organization_description?: string;
    public organization_url?: string;
    public maintainer_contact_info?: MaintainerContactInfo;
    public locations?: string[];
    public categories?: string[];
}

export class UpdateResourceDto {
    public name?: string;
    public organization_description?: string;
    public organization_url?: string;
    public maintainer_contact_info?: MaintainerContactInfo;
    public locations?: string[];
    public categories?: string[];
}

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

export class Resource {
    public readonly id!: string;
    @Property()
    public readonly updated_at!: Date;
    @Property()
    public readonly created_at!: Date;
    @Property({ required: true })
    public name!: string;
    @Property()
    public organization_description?: string;
    @Property()
    public organization_url?: string;
    @Property()
    public maintainer_contact_info?: MaintainerContactInfo;
    @Property({ itemsRef: () => Location })
    public locations?: Ref<Location>[];
    @Property({ itemsRef: () => Category })
    public categories?: Ref<Category>[];
}

export type ResourceType = DocumentType<Resource>;

export const ResourceModelModule: DynamicModule = TypegooseModule.forFeature([
    {
        typegooseClass: Resource,
        schemaOptions: {
            timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
            toJSON: {
                virtuals: true,
                versionKey: false,
                transform: function (doc, ret) {
                    // remove these props when object is serialized
                    delete ret._id;
                },
            },
        },
    },
]);

import { Resource } from '../resource/resource.entity';
import {
    Ref,
    prop as Property,
    DocumentType,
    modelOptions,
} from '@typegoose/typegoose';
import { TypegooseModule } from 'nestjs-typegoose';
import { DynamicModule } from '@nestjs/common';

export class CreateCategoryDto {
    public name!: string;
    public icon_name!: string;
    public resources?: string[];
    public children?: string[];
    public parents?: string[];
}

export class UpdateCategoryDto {
    public name?: string;
    public icon_name?: string;
    public resources?: string[];
    public children?: string[];
    public parents?: string[];
}

@modelOptions({
    schemaOptions: {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: function (_doc, ret) {
                // remove these props when object is serialized
                delete ret._id;
            },
        },
    },
})
export class Category {
    public readonly id!: string;
    @Property()
    public readonly updated_at!: Date;
    @Property()
    public readonly created_at!: Date;
    @Property({ required: true, index: true, unique: true })
    public name!: string;
    @Property({ required: true })
    public icon_name!: string;
    @Property({ ref: () => Resource })
    public resources?: Ref<Resource>[];
    @Property({ ref: () => Category })
    public children?: Ref<Category>[];
    @Property({ ref: () => Category })
    public parents?: Ref<Category>[];
}

export type CategoryType = DocumentType<Category>;

export const CategoryModelModule: DynamicModule = TypegooseModule.forFeature([
    Category,
]);

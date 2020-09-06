import { Resource } from '../resource/resource.entity';
import { Ref, prop as Property, DocumentType } from '@typegoose/typegoose';
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

export class Category {
    public readonly id!: string;
    @Property()
    public readonly updated_at!: Date;
    @Property()
    public readonly created_at!: Date;
    @Property({ required: true })
    public name!: string;
    @Property({ required: true })
    public icon_name!: string;
    @Property({ itemsRef: () => Resource })
    public resources?: Ref<Resource>[];
    @Property({ itemsRef: () => Category })
    public children?: Ref<Category>[];
    @Property({ itemsRef: () => Category })
    public parents?: Ref<Category>[];
}

export type CategoryType = DocumentType<Category>;

export const CategoryModelModule: DynamicModule = TypegooseModule.forFeature([
    {
        typegooseClass: Category,
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

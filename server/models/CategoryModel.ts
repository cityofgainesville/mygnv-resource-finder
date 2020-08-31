import {
  Ref,
  prop as Property,
  modelOptions,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose';
import { Resource } from './ResourceModel';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({
  options: { customName: 'Category' },
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
export class Category {
  public readonly id!: string;
  @Property()
  public readonly updated_at!: Date;
  @Property()
  public readonly created_at!: Date;
  @Property({ required: true })
  public name!: string;
  @Property({ itemsRef: 'Resource' })
  public resources: Ref<Resource>[];
  @Property({ itemsRef: 'Category' })
  public children?: Ref<Category>[];
  @Property({ itemsRef: 'Category' })
  public parents?: Ref<Category>[];
  @Property({ required: true })
  public icon_name!: string;
}

export type CategoryType = DocumentType<Category>;

export const CategoryModel = getModelForClass(Category);

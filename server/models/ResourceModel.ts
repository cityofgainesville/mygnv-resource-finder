import { Category } from './CategoryModel';
import { Location } from './LocationModel';
import {
  Ref,
  prop as Property,
  modelOptions,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

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
  options: { customName: 'Resource' },
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
  @Property({ itemsRef: 'Location' })
  public locations?: Ref<Location>[];
  @Property({ itemsRef: 'Category' })
  public categories?: Ref<Category>[];
}

export type ResourceType = DocumentType<Resource>;

export const ResourceModel = getModelForClass(Resource);

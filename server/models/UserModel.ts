import {
  Ref,
  prop as Property,
  getModelForClass,
  buildSchema,
  addModelToTypegoose,
  DocumentType,
  modelOptions,
} from '@typegoose/typegoose';
import { IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';
import passportLocalMongoose from 'passport-local-mongoose';
import { Category } from './CategoryModel';
import { Resource } from './ResourceModel';
import { Location } from './LocationModel';
import {
  PassportLocalModel,
  PassportLocalSchema,
  PassportLocalDocument,
  model,
} from 'mongoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export enum Role {
  OWNER = 'Owner',
  EDITOR = 'Editor',
}

@modelOptions({
  schemaOptions: {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function(doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.hash;
        delete ret.salt;
        delete ret.attempts;
        delete ret.last;
      },
    },
  },
})
export class User {
  public readonly id!: string;
  @Property()
  public readonly updated_at!: Date;
  @Property()
  public readonly created_at!: Date;
  @Property({ unique: true, required: true })
  public email!: string;
  @Property({ required: true })
  public first_name!: string;
  @Property({ required: true })
  public last_name!: string;
  @Property({ enum: Role, required: true, default: Role.EDITOR })
  public role!: Role;
  @Property({ itemsRef: 'Location' })
  public location_can_edit?: Ref<Location>[];
  @Property({ itemsRef: 'Resource' })
  public resource_can_edit?: Ref<Resource>[];
  @Property({ itemsRef: 'Category' })
  public cat_can_edit_members?: Ref<Category>[];
}

const userSchema = buildSchema(User) as PassportLocalSchema;

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  session: false,
});

export type UserType = PassportLocalDocument &
  User &
  IObjectWithTypegooseFunction;

export const UserModel = addModelToTypegoose(
  model<UserType>('User', userSchema),
  (User as unknown) as PassportLocalModel<UserType>
);

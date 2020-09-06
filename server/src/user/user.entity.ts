import { Ref, prop as Property, DocumentType } from '@typegoose/typegoose';
import { TypegooseModule } from 'nestjs-typegoose';
import { DynamicModule } from '@nestjs/common';
import { Category } from '../category/category.entity';
import { Resource } from '../resource/resource.entity';
import { Location } from '../location/location.entity';

export enum Role {
    OWNER = 'Owner',
    EDITOR = 'Editor',
}

export class LoginUserDto {
    email: string;
    password: string;
}

export class LoginUserResponseDto {
    user: UserResponseDto;
    access_token: string;
    refresh_token: { token: string; expires: Date };
}

export class CreateUserDto {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: Role;
    location_can_edit?: string[];
    resource_can_edit?: string[];
    cat_can_edit_members?: string[];
}

export class UpdateUserDto {
    email?: string;
    password?: UpdatePasswordDto;
    first_name?: string;
    last_name?: string;
    role?: Role;
    location_can_edit?: string[];
    resource_can_edit?: string[];
    cat_can_edit_members?: string[];
}

export class UpdatePasswordDto {
    new_password!: string;
    old_password!: string;
}

export class UserResponseDto {
    readonly id!: string;
    @Property()
    readonly updated_at!: Date;
    @Property()
    readonly created_at!: Date;
    @Property({ unique: true, required: true })
    email!: string;
    @Property({ required: true })
    first_name!: string;
    @Property({ required: true })
    last_name!: string;
    @Property({ enum: Role, required: true, default: Role.EDITOR })
    role!: Role;
    @Property({ itemsRef: () => Location })
    location_can_edit?: Ref<Location>[];
    @Property({ itemsRef: () => Resource })
    resource_can_edit?: Ref<Resource>[];
    @Property({ itemsRef: () => Category })
    cat_can_edit_members?: Ref<Category>[];
}

export class User extends UserResponseDto {
    @Property({ required: true })
    hash!: string;
}

export type UserType = DocumentType<User>;

export const UserModelModule: DynamicModule = TypegooseModule.forFeature([
    {
        typegooseClass: User,
        schemaOptions: {
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            },
            toJSON: {
                virtuals: true,
                versionKey: false,
                transform: function (doc, ret) {
                    // remove these props when object is serialized
                    delete ret._id;
                    delete ret.hash;
                },
            },
        },
    },
]);

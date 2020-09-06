import { Ref, prop as Property, DocumentType } from '@typegoose/typegoose';
import { User } from '../user/user.entity';
import { TypegooseModule } from 'nestjs-typegoose';
import ms from 'ms';
import { DynamicModule } from '@nestjs/common';
import { ENV_VAR } from '../dotenv';

const refreshTokenExpiration = ms(ENV_VAR.REFRESH_TOKEN_EXPIRATION);

const documentExpires = new Date(Date.now() + 2 * refreshTokenExpiration);

export class RefreshTokenDto {
    refresh_token?: string;
}

export class RefreshToken {
    public readonly id!: string;
    @Property()
    public readonly updated_at!: Date;
    @Property({ expires: documentExpires.getTime() })
    public readonly created_at!: Date;
    @Property({ required: true, ref: () => User })
    public user!: Ref<User>;
    @Property({ unique: true, required: true })
    public token!: string;
    @Property({ required: true })
    public expires: Date;
    @Property()
    public created_by_ip: string;
    @Property()
    public revoked: Date;
    @Property()
    public revoked_by_ip: string;
    @Property()
    public replaced_by_token: string;

    public get is_expired() {
        return Date.now() >= this.expires.getTime();
    }
    public get is_active() {
        return !this.revoked && !this.is_expired;
    }
}

export type RefreshTokenType = DocumentType<RefreshToken>;

export const RefreshTokenModelModule: DynamicModule = TypegooseModule.forFeature(
    [
        {
            typegooseClass: RefreshToken,
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
                        delete ret.id;
                        delete ret.user;
                        delete ret.updated_at;
                        delete ret.created_at;
                        delete ret.is_expired;
                        delete ret.is_active;
                    },
                },
            },
        },
    ]
);

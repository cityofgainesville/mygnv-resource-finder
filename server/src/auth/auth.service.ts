import { UserService } from '../user/user.service';
import { Injectable, HttpException, forwardRef, Inject } from '@nestjs/common';
import {
    User,
    CreateUserDto,
    LoginUserDto,
    UserResponseDto,
    LoginUserResponseDto,
    Role,
} from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from 'nestjs-typegoose';
import * as bcrypt from 'bcrypt';
import { ENV_VAR } from '../dotenv';
import { ReturnModelType } from '@typegoose/typegoose';
import { RefreshTokenType, RefreshToken } from './auth.entity';
import ms from 'ms';
import crypto from 'crypto';

const refreshTokenExpiration = ms(ENV_VAR.REFRESH_TOKEN_EXPIRATION);

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private userService: UserService,
        private jwtService: JwtService,
        @InjectModel(User)
        private readonly UserModel: ReturnModelType<typeof User>,
        @InjectModel(RefreshToken)
        private readonly RefreshTokenModel: ReturnModelType<typeof RefreshToken>
    ) {}

    async validateUser(
        email: string,
        password: string
    ): Promise<UserResponseDto | null> {
        const user = await this.userService.findOneByEmail(email);
        if (await bcrypt.compare(password, user.hash)) {
            return user;
        }
        return null;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(Number(ENV_VAR.BCRYPT_ROUNDS));
        return await bcrypt.hash(password, salt);
    }

    async login(
        loginUserDto: LoginUserDto,
        ip: string
    ): Promise<LoginUserResponseDto> {
        const user = await this.validateUser(
            loginUserDto.email,
            loginUserDto.password
        );
        if (!user) return null;
        const payload = { sub: user.id, email: user.email };
        const jwtToken = this.jwtService.sign(payload);
        const refreshToken = await this.generateRefreshToken(user, ip);
        await refreshToken.save();
        return {
            user,
            access_token: jwtToken,
            refresh_token: {
                token: refreshToken.token,
                expires: refreshToken.expires,
            },
        };
    }

    async register(
        createUserDto: CreateUserDto,
        user: User,
        ip: string
    ): Promise<LoginUserResponseDto> {
        const hash = await this.hashPassword(createUserDto.password);
        delete createUserDto.password;
        const newUser = new this.UserModel(createUserDto);
        newUser.hash = hash;

        if (user?.role !== Role.OWNER) {
            newUser.location_can_edit = [];
            newUser.resource_can_edit = [];
            newUser.cat_can_edit_members = [];
            newUser.role = Role.EDITOR;
        }

        newUser.save();

        const payload = { sub: user.id, email: user.email };
        const jwtToken = this.jwtService.sign(payload);
        const refreshToken = await this.generateRefreshToken(newUser, ip);
        await refreshToken.save();

        return {
            user: newUser as UserResponseDto,
            access_token: jwtToken,
            refresh_token: {
                token: refreshToken.token,
                expires: refreshToken.expires,
            },
        };
    }

    async generateRefreshToken(
        user: UserResponseDto,
        ip: string
    ): Promise<RefreshTokenType> {
        const expiryDate = new Date(Date.now() + refreshTokenExpiration);
        return new this.RefreshTokenModel({
            user: user.id,
            token: this.randomTokenString(),
            expires: expiryDate,
            createdByIp: ip,
        });
    }

    randomTokenString(): string {
        return crypto.randomBytes(128).toString('base64');
    }

    async refreshToken(refreshToken: string, ip: string) {
        if (!refreshToken) throw new HttpException({}, 400);

        const oldRefreshToken = await this.RefreshTokenModel.findOne({
            token: refreshToken,
        }).populate('user');

        if (!oldRefreshToken?.is_active) {
            throw new HttpException('Refresh token is revoked', 401);
        }

        const newRefreshToken = await this.generateRefreshToken(
            oldRefreshToken.user as User,
            ip
        );

        oldRefreshToken.revoked = new Date(Date.now());
        oldRefreshToken.revoked_by_ip = ip;
        oldRefreshToken.replaced_by_token = newRefreshToken.token;
        await oldRefreshToken.save();
        await newRefreshToken.save();

        // generate new jwt

        const user = oldRefreshToken.user as User;
        const payload = { sub: user.id, email: user.email };
        const jwtToken = this.jwtService.sign(payload);

        return {
            user,
            access_token: jwtToken,
            refresh_token: {
                token: newRefreshToken.token,
                expires: newRefreshToken.expires,
            },
        };
    }

    async revokeTokens(
        user_id: string,
        userLoggedIn: User,
        ip: string
    ): Promise<void> {
        if (userLoggedIn?.id !== user_id && userLoggedIn?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);

        const refreshTokens = await this.RefreshTokenModel.find({
            user: user_id,
        });
        if (refreshTokens)
            refreshTokens.forEach(async (refreshToken) => {
                if (refreshToken.is_active) {
                    refreshToken.revoked = new Date(Date.now());
                    refreshToken.revoked_by_ip = ip;
                    await refreshToken.save();
                }
            });
    }

    async revokeToken(refreshToken: string, user: User, ip: string) {
        if (!refreshToken) throw new HttpException('Token is required', 200);

        const refreshTokenDoc = await this.RefreshTokenModel.findOne({
            token: refreshToken,
        }).populate('user');

        if (!refreshTokenDoc?.is_active) {
            throw new HttpException('Refresh token already revoked', 304);
        }

        // users can revoke their own tokens and admins can revoke any tokens
        if (
            (refreshTokenDoc.user as User)?.id !== user?.id &&
            user?.role !== Role.OWNER
        ) {
            throw new HttpException('Unauthorized', 401);
        }

        refreshTokenDoc.revoked = new Date(Date.now());
        refreshTokenDoc.revoked_by_ip = ip;
        await refreshTokenDoc.save();
    }
}

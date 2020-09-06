import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ENV_VAR } from '../dotenv';
import { User, UserResponseDto } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userService: UserService,
        @InjectModel(User)
        private readonly UserModel: ReturnModelType<typeof User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: ENV_VAR.JWT_SECRET,
        });
    }

    async validate(payload: {
        sub: string;
        email: string;
    }): Promise<UserResponseDto | null> {
        try {
            return await this.UserModel.findOne({ _id: payload.sub });
        } catch (error) {
            return error;
        }
    }
}

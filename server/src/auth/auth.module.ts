import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ENV_VAR } from '../dotenv';
import { UserModelModule } from '../user/user.entity';
import { RefreshTokenModelModule } from './auth.entity';

@Module({
    imports: [
        forwardRef(() => UserModule),
        UserModelModule,
        PassportModule,
        RefreshTokenModelModule,
        JwtModule.register({
            secret: ENV_VAR.JWT_SECRET,
            signOptions: { expiresIn: ENV_VAR.JWT_EXPIRATION },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}

import { Module, forwardRef } from '@nestjs/common';
import { UserModelModule } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule), UserModelModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, UserModelModule],
})
export class UserModule {}

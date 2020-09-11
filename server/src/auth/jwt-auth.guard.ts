import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    handleRequest(_err: any, user: any, _info: any) {
        return user;
    }
}

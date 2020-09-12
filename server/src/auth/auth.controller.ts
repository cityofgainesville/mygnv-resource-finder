import {
    Controller,
    Request as Req,
    Response as Res,
    Post,
    UseGuards,
    Get,
    Body,
    Ip,
    Put,
    Query,
} from '@nestjs/common';
import {
    ApiCookieAuth,
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard, OptionalJwtAuthGuard } from './jwt-auth.guard';
import {
    CreateUserDto,
    LoginUserDto,
    UserResponseDto,
} from '../user/user.entity';
import { Request, Response, CookieOptions } from 'express';
import { LoginUserResponseDto } from '../user/user.entity';
import { RefreshTokenDto } from './auth.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({
        description:
            'Logs in the user. New refresh token will be output in the response and a cookie will be set.',
    })
    @Put('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() res: Response,
        @Ip() ip: string
    ): Promise<LoginUserResponseDto> {
        const data = await this.authService.login(loginUserDto, ip);

        this.setRefreshTokenCookie(res, data.refresh_token);

        res.json(data);
        return data;
    }

    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Post('register')
    async register(
        @Body() createUserDto: CreateUserDto,
        @Req() req: Request,
        @Res() res: Response,
        @Ip() ip: string
    ): Promise<LoginUserResponseDto> {
        const data = await this.authService.register(
            createUserDto,
            req.user,
            ip
        );

        // If not already logged on
        if (!req.user) {
            this.setRefreshTokenCookie(res, data.refresh_token);
        }

        res.json(data);
        return data;
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: Request, @Res() res: Response): UserResponseDto {
        res.json(req.user);
        return req.user;
    }

    @ApiOperation({
        description:
            'Refreshes the refresh_token. Token to be refreshed can be passed as cookie or as field in body. New refresh token will be output in the response and a cookie will be set.',
    })
    @ApiCookieAuth()
    @Post('refresh-token')
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Req() req: Request,
        @Res() res: Response,
        @Ip() ip: string
    ): Promise<LoginUserResponseDto> {
        const refreshToken = req.cookies.refresh_token
            ? req.cookies.refresh_token
            : refreshTokenDto.refresh_token;

        const data = await this.authService.refreshToken(refreshToken, ip);
        this.setRefreshTokenCookie(res, data.refresh_token);

        res.json(data);
        return data;
    }

    async setRefreshTokenCookie(
        res: Response,
        refreshToken: { token: string; expires: Date }
    ) {
        // create http only cookie with refresh token that expires
        const cookieOptions: CookieOptions = {
            sameSite: 'strict',
            secure: false,
            httpOnly: true,
            expires: refreshToken.expires,
        };
        res.cookie('refresh_token', refreshToken.token, cookieOptions);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('revoke-tokens/:user_id')
    async revokeTokens(
        @Query('user_id') userId: string,
        @Req() req: Request,
        @Ip() ip: string
    ): Promise<void> {
        return await this.authService.revokeTokens(userId, req.user, ip);
    }

    @ApiCookieAuth('refresh-token')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('revoke-token')
    async revokeToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Req() req: Request,
        @Ip() ip: string
    ) {
        const refreshToken = req.cookies.refresh_token
            ? req.cookies.refresh_token
            : refreshTokenDto.refresh_token;

        return this.authService.revokeToken(refreshToken, req.user, ip);
    }
}

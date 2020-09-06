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
    UnauthorizedException,
} from '@nestjs/common';
import { ApiCookieAuth, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard, OptionalJwtAuthGuard } from './jwt-auth.guard';
import {
    CreateUserDto,
    LoginUserDto,
    UserResponseDto,
} from '../user/user.entity';
import { Request, Response } from 'express';
import { LoginUserResponseDto } from '../user/user.entity';
import { RefreshTokenDto } from './auth.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Put('login')
    async login(
        @Body() loginUserDto: LoginUserDto,
        @Res() res: Response,
        @Ip() ip: string
    ): Promise<LoginUserResponseDto> {
        try {
            const data = await this.authService.login(loginUserDto, ip);

            this.setRefreshTokenCookie(res, data.refresh_token);

            return (res.json(data) as unknown) as LoginUserResponseDto;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
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
        const data = await this.authService.register(req.body, req.user, ip);

        // If not already logged on
        if (!req.user) {
            this.setRefreshTokenCookie(res, data.refresh_token);
        }

        return (res.json(data) as unknown) as LoginUserResponseDto;
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: Request, @Res() res: Response): UserResponseDto {
        return (res.json(req.user) as unknown) as UserResponseDto;
    }

    @ApiCookieAuth('refresh-token')
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

        return (res.json(data) as unknown) as LoginUserResponseDto;
    }

    async setRefreshTokenCookie(
        res: Response,
        refreshToken: { token: string; expires: Date }
    ) {
        // create http only cookie with refresh token that expires
        const cookieOptions = {
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

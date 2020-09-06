import {
    Controller,
    UseGuards,
    Put,
    Param,
    Body,
    Request as Req,
    Delete,
    Get,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto, UserResponseDto } from './user.entity';
import { UserService } from './user.service';
import { Request } from 'express';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiQuery({
        name: 'categories',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'resources',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'locations',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('list')
    async getList(
        @Query('categories') categories: string,
        @Query('resources') resources: string,
        @Query('locations') locations: string,
        @Req() req: Request
    ): Promise<UserResponseDto[]> {
        return await this.userService.list(
            categories,
            resources,
            locations,
            {},
            req.user
        );
    }

    @ApiQuery({
        name: 'categories',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'resources',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'locations',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBody({
        required: false,
        type: Object,
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('list')
    async list(
        @Query('categories') categories: string,
        @Query('resources') resources: string,
        @Query('locations') locations: string,
        @Body() filter: object,
        @Req() req: Request
    ): Promise<UserResponseDto[]> {
        return await this.userService.list(
            categories,
            resources,
            locations,
            filter,
            req.user
        );
    }

    @ApiQuery({
        name: 'categories',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'resources',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'locations',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(
        @Param('id') id: string,
        @Query('categories') categories: string,
        @Query('resources') resources: string,
        @Query('locations') locations: string,
        @Req() req: Request
    ): Promise<UserResponseDto> {
        return await this.userService.read(
            id,
            categories,
            resources,
            locations,
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('update/:id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req: Request
    ): Promise<UserResponseDto> {
        return await this.userService.update(id, updateUserDto, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
        return await this.userService.delete(id, req.user);
    }
}

import { ResourceService } from './resource.service';
import {
    Controller,
    UseGuards,
    Get,
    Query,
    Request as Req,
    Body,
    Put,
    Param,
    Post,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import {
    Resource,
    CreateResourceDto,
    UpdateResourceDto,
} from './resource.entity';
import { OptionalJwtAuthGuard, JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Resources')
@Controller('resources')
export class ResourceController {
    constructor(private resourceService: ResourceService) {}

    @ApiQuery({
        name: 'locations',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'categories',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Get('list')
    async getList(
        @Query('locations') locations: string,
        @Query('categories') categories: string,
        @Req() req: Request
    ): Promise<Resource[]> {
        return await this.resourceService.list(
            locations,
            categories,
            {},
            req.user
        );
    }

    @ApiQuery({
        name: 'locations',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'categories',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBody({
        required: false,
        type: UpdateResourceDto,
        description: 'Specify selection filter',
    })
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Put('list')
    async list(
        @Query('locations') locations: string,
        @Query('categories') categories: string,
        @Body() filter: UpdateResourceDto,
        @Req() req: Request
    ): Promise<Resource[]> {
        return await this.resourceService.list(
            locations,
            categories,
            filter,
            req.user
        );
    }

    @ApiQuery({
        name: 'locations',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'categories',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    async read(
        @Param('id') id: string,
        @Query('locations') locations: string,
        @Query('categories') categories: string,
        @Req() req: Request
    ): Promise<Resource> {
        return await this.resourceService.read(
            id,
            locations,
            categories,
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(
        @Body() createResourceDto: CreateResourceDto,
        @Req() req: Request
    ): Promise<Resource> {
        return await this.resourceService.create(createResourceDto, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('update/:id')
    async update(
        @Param('id') id: string,
        @Body() updateResourceDto: UpdateResourceDto,
        @Req() req: Request
    ): Promise<Resource> {
        return await this.resourceService.update(
            id,
            updateResourceDto,
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
        return await this.resourceService.delete(id, req.user);
    }
}

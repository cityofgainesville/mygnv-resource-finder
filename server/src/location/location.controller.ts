import { LocationService } from './location.service';
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
import { ApiTags, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OptionalJwtAuthGuard, JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import {
    Location,
    CreateLocationDto,
    UpdateLocationDto,
} from './location.entity';

@ApiTags('Locations')
@Controller('locations')
export class LocationController {
    constructor(private locationService: LocationService) {}

    @ApiQuery({
        name: 'resource',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Get('list')
    async getList(
        @Query('resource') resource: string,
        @Req() req: Request
    ): Promise<Location[]> {
        return await this.locationService.list(resource, {}, req.user);
    }

    @ApiQuery({
        name: 'resource',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBody({
        required: false,
        type: UpdateLocationDto,
        description: 'Specify selection filter',
    })
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Put('list')
    async list(
        @Query('resource') resource: string,
        @Body() filter: UpdateLocationDto,
        @Req() req: Request
    ): Promise<Location[]> {
        return await this.locationService.list(resource, filter, req.user);
    }

    @ApiQuery({
        name: 'resource',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    async read(
        @Param('id') id: string,
        @Query('resource') resource: string,
        @Req() req: Request
    ): Promise<Location> {
        return await this.locationService.read(id, resource, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(
        @Body() createLocationDto: CreateLocationDto,
        @Req() req: Request
    ): Promise<Location> {
        return await this.locationService.create(createLocationDto, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('update/:id')
    async update(
        @Param('id') id: string,
        @Body() updateLocationDto: UpdateLocationDto,
        @Req() req: Request
    ): Promise<Location> {
        return await this.locationService.update(
            id,
            updateLocationDto,
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
        return await this.locationService.delete(id, req.user);
    }
}

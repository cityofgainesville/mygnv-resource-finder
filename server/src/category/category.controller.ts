import {
    Controller,
    Get,
    Query,
    Request as Req,
    Body,
    Put,
    Param,
    Post,
    UseGuards,
    Delete,
} from '@nestjs/common';
import { CategoryService } from '../category/category.service';
import { Request } from 'express';
import {
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
} from './category.entity';
import { ApiQuery, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @ApiQuery({
        name: 'children',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'parents',
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
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Get('list')
    async getList(
        @Query('children') children: string,
        @Query('parents') parents: string,
        @Query('resources') resources: string,
        @Req() req: Request
    ): Promise<Category[]> {
        return await this.categoryService.list(
            children,
            parents,
            resources,
            {},
            req.user
        );
    }

    @ApiQuery({
        name: 'children',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'parents',
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
    @ApiBody({
        required: false,
        type: Object,
    })
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Put('list')
    async list(
        @Query('children') children: string,
        @Query('parents') parents: string,
        @Query('resources') resources: string,
        @Body() filter: object,
        @Req() req: Request
    ): Promise<Category[]> {
        return await this.categoryService.list(
            children,
            parents,
            resources,
            filter,
            req.user
        );
    }

    @ApiQuery({
        name: 'children',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'parents',
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
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Get('listTopLevel')
    async listTopLevel(
        @Query('children') children: string,
        @Query('parents') parents: string,
        @Query('resources') resources: string,
        @Req() req: Request
    ): Promise<Category[]> {
        return await this.categoryService.listTopLevel(
            children,
            parents,
            resources,
            req.user
        );
    }

    @ApiQuery({
        name: 'children',
        required: false,
        type: String,
        description: '"true" to populate',
    })
    @ApiQuery({
        name: 'parents',
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
    @ApiBearerAuth()
    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    async read(
        @Param('id') id: string,
        @Query('children') children: string,
        @Query('parents') parents: string,
        @Query('resources') resources: string,
        @Req() req: Request
    ): Promise<Category> {
        return await this.categoryService.read(
            id,
            children,
            parents,
            resources,
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Req() req: Request
    ): Promise<Category> {
        return await this.categoryService.create(createCategoryDto, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('update/:id')
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Req() req: Request
    ): Promise<Category> {
        return await this.categoryService.update(
            id,
            updateCategoryDto,
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
        return await this.categoryService.delete(id, req.user);
    }
}

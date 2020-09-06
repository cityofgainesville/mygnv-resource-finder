import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryModelModule } from './category.entity';
import { ResourceModelModule } from '../resource/resource.entity';

@Module({
    imports: [CategoryModelModule, ResourceModelModule],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService, CategoryModelModule],
})
export class CategoryModule {}

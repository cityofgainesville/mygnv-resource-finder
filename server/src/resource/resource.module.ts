import { Module } from '@nestjs/common';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { ResourceModelModule } from './resource.entity';
import { CategoryModelModule } from '../category/category.entity';
import { LocationModelModule } from '../location/location.entity';

@Module({
    imports: [ResourceModelModule, CategoryModelModule, LocationModelModule],
    controllers: [ResourceController],
    providers: [ResourceService],
    exports: [ResourceService, ResourceModelModule],
})
export class ResourceModule {}

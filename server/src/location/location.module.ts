import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { LocationModelModule } from './location.entity';
import { ResourceModelModule } from '../resource/resource.entity';
import { CategoryModelModule } from '../category/category.entity';

@Module({
    imports: [LocationModelModule, ResourceModelModule, CategoryModelModule],
    controllers: [LocationController],
    providers: [LocationService],
    exports: [LocationService, LocationModelModule],
})
export class LocationModule {}

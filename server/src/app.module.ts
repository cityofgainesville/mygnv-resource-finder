import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { LocationModule } from './location/location.module';
import { ResourceModule } from './resource/resource.module';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

@Module({
    imports: [
        TypegooseModule.forRoot(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '../../client/dist'),
        }),
        ServeStaticModule.forRoot({
            serveRoot: '/nestjs-docs',
            rootPath: path.join(__dirname, '../documentation'),
        }),
        UserModule,
        AuthModule,
        CategoryModule,
        LocationModule,
        ResourceModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

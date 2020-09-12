import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserType } from './user/user.entity';

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface User extends UserType {}
        interface Request {
            user?: User;
        }
    }
}

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const isDevelopment = process.env.NODE_ENV === 'development';

const port = process.env.PORT
    ? isDevelopment
        ? Number(process.env.PORT) + 1
        : Number(process.env.PORT)
    : 8080;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.setGlobalPrefix('api');

    const options = new DocumentBuilder()
        .setTitle('MyGNV Resource Finder Api')
        .setDescription('REST API used by the MyGNV Resource Finder')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
        .addCookieAuth('refresh_token', {
            type: 'apiKey',
        })
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    await app.listen(port);
    console.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();

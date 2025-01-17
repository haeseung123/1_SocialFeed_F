import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { JwtExceptionFilter } from './commons/filter/jwt-exception.filter';
import { TransformInterceptor } from './commons/transform.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const PORT = configService.getOrThrow('SERVER_PORT');
    const reflector = new Reflector();

    app.useGlobalInterceptors(new TransformInterceptor(reflector), new ClassSerializerInterceptor(reflector));
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    app.useGlobalFilters(new JwtExceptionFilter());

    await app.listen(PORT);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import {
  version as pkgJsonVersion,
  description as pkgDescription,
  name as pkgName,
} from '../package.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1', { exclude: ['api-docs'] });

  const config = new DocumentBuilder()
    .setTitle(pkgName)
    .setDescription(pkgDescription)
    .setVersion(pkgJsonVersion)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeUnsetFields: false,
      },
    }),
  );

  // Security
  app.use(helmet());
  app.enableCors();

  await app.listen(3000);
}

bootstrap();

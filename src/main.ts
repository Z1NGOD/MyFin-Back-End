import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import {
  version as pkgJsonVersion,
  description as pkgDescription,
  name as pkgName,
} from '../package.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle(pkgName)
    .setDescription(pkgDescription)
    .setVersion(pkgJsonVersion)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix('api/v1', { exclude: ['api-docs'] });

  // Security
  app.use(helmet());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();

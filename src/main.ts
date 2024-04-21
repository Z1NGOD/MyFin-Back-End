import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Security
  app.use(helmet());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();

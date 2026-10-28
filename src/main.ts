import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Attach Helmet globally
  app.use(helmet())

  // Global Safety Net (Exception Filter)
  app.useGlobalFilters(new AllExceptionsFilter())

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
    }
  ));
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
  
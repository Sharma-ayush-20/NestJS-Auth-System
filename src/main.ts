import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js'
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Attach Helmet globally
  app.use(helmet())

  // Catches and formats all ERRORS
  app.useGlobalFilters(new AllExceptionsFilter())
  // Formats all SUCCESSFUL responses
  app.useGlobalInterceptors(new TransformInterceptor())

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      forbidNonWhitelisted: true,
    }
  ));

  //Swagger Configuration
  const config = new DocumentBuilder()
  .setTitle('LMS Backend API')
  .setDescription('Production-ready Learning Management System API built with NestJS, MongoDB & Redis')
  .setVersion('1.0')
  .addBearerAuth() // Enables the "Authorize" button to paste JWT tokens
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true // Remembers your JWT token even when you refresh the browser!
    }
  }) // Accessible at /api

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
  
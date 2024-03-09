import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as session from 'express-session';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    bufferLogs: true,
  });

  // Enable auto-validation
  app.useGlobalPipes(new ValidationPipe());

  // Enable logging
  app.useLogger(app.get(Logger));

  // Enable session management
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Enable Swagger
  const config = new DocumentBuilder()
    .setTitle('ToiletPeek API')
    .setDescription('API description of the application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  await app.listen(8535);
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as session from 'express-session';
import * as passport from 'passport';

import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotFoundInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    bufferLogs: true,
  });

  // Interceptors
  app.useGlobalInterceptors(new NotFoundInterceptor());

  // Enable CORS
  app.enableCors();

  // Get the ConfigService
  const configService = app.get(ConfigService);

  // Enable auto-validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );

  // Enable logging
  app.useLogger(app.get(Logger));

  // Enable session management
  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
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

  // Enable Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  // Start the application
  await app.listen(8535);
}

bootstrap();

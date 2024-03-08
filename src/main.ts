import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    bufferLogs: true,
  });

  // Logger
  app.useLogger(app.get(Logger));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('ToiletPeek API')
    .setDescription('API description of the application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the app
  await app.listen(8535);
}

bootstrap();

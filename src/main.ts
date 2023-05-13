import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setting up global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      // This will remove all properties that are not in the DTO
      whitelist: true,
      // This will transform the DTO to the correct type (e.g. string to number)
      transform: true,
      // This will automatically throw an error if the DTO is not valid
      forbidNonWhitelisted: true,
      // This will automatically throw an error if a property is not present
      forbidUnknownValues: true,
    }),
  );

  // Setting up Swagger
  const config = new DocumentBuilder()
    .setTitle('Storage Service API')
    .setDescription('Logic for uploading files and managing users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Setting up CORS
  // app.enableCors({
  //   origin: 'http://192.168.1.3:3000',
  // });
  await app.listen(3000, '0.0.0.0');
}
bootstrap();

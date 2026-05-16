import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Procurement API')
    .setDescription('REST API for authentication, users, and procurement workflows')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions: {
      persistAuthorization: true
    }
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  Logger.log(`Backend running on http://localhost:${port}/api`, 'Bootstrap');
  Logger.log(`Swagger UI running on http://localhost:${port}/api/docs`, 'Bootstrap');
}

bootstrap().catch((error: unknown) => {
  Logger.error(error);
  process.exit(1);
});

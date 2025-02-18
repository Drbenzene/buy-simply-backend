import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const options = new DocumentBuilder()
    .setTitle('Buy Simple Assessment')
    .setDescription('API Documentation for Buy Simple API')
    .setVersion('1.0')
    .addServer('', 'Live environment')
    .addServer('http://localhost:6000/', 'Local environment') // Use localhost explicitly
    .addTag('Buy Simple Backend Assessment')
    .addBearerAuth()
    .build();

  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'BUYSIMPLESESSIONSECRET',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60,
      },
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Generate Swagger Document
  const document = SwaggerModule.createDocument(app, options);

  // Set up Swagger UI
  SwaggerModule.setup('swagger', app, document); // Change `/docs` to `/swagger`

  await app.listen(process.env.PORT || 6000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();

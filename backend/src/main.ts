// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ConfigService } from '@nestjs/config';
// import { ValidationPipe } from '@nestjs/common';
// import { HttpExceptionFilter } from './filters/http-exception.filter';
// async function bootstrap() {
//   try {
//     const app = await NestFactory.create(AppModule, { cors: true });
//     const configService = app.get(ConfigService); 
//     app.useGlobalPipes(
//       new ValidationPipe({ transform: true, whitelist: true }),
//     ); 
//     app.useGlobalFilters(new HttpExceptionFilter());
//     const port = configService.get('port');
//     await app.listen(port);
//     console.log(`Server started on port: ${port}`);
//   } catch (error) {
//     console.error('Error when starting the server:', error);
//     process.exit(1);
//   }
// }
// bootstrap();


// src/main.ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { randomBytes } from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = { randomBytes } as any;
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, { cors: true });
 
    app.enableShutdownHooks();
 
    const configService = app.get(ConfigService);
    const port = configService.get<number>('port', 3000);
 
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
 
    app.useGlobalFilters(new HttpExceptionFilter());
 
    await app.listen(port);
    logger.log(`Server started on port: ${port}`);
 
    process.on('SIGTERM', () => logger.log('SIGTERM received – shutting down'));
    process.on('SIGINT', () => logger.log('SIGINT received – shutting down'));
  } catch (error) {
    logger.error('Error when starting the server:', error);
    process.exit(1);
  }
}

bootstrap();

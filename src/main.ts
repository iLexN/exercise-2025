import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const snapshotFlag = process.env.app_snapshot === 'true';

  const app = await NestFactory.create(AppModule, {
    snapshot: snapshotFlag,
    logger: new ConsoleLogger({
      prefix: 'MyApp', // Default is "Nest"
      json: true,
    }),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

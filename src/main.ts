import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const snapshotFlag = process.env.app_snapshot === 'true';

  const app = await NestFactory.create(AppModule, {
    snapshot: snapshotFlag,
    logger: new ConsoleLogger({
      prefix: 'MyApp', // Default is "Nest"
      json: true,
    }),
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

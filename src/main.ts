import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const snapshotFlag = process.env.app_snapshot === 'true';

  const app = await NestFactory.create(AppModule, {
    snapshot: snapshotFlag,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

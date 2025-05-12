import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('N1 example title')
    .setDescription('N1 example description ... ')
    .setVersion('1.0')
    // .addTag('cats')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

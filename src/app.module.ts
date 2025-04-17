import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewaresModule } from './middlewares/middlewares.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot(), MiddlewaresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

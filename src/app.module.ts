import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { UtilityModule } from './utility/utility.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    MiddlewaresModule,
    UtilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

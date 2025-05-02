import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewaresModule } from './middlewares/middlewares.module';
import { UtilityModule } from './utility/utility.module';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './redis.options';
import { AuthModule } from './auth/auth.module';
import { VertupayModule } from './vertupay/vertupay.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TransactionsModule } from './transactions/transactions.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync(RedisOptions),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MiddlewaresModule,
    UtilityModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    VertupayModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

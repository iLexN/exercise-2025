import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { LoggerTimesMiddleware } from './logger.times.middleware';

@Module({})
export class MiddlewaresModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
    consumer.apply(LoggerTimesMiddleware).forRoutes('*');
  }
}

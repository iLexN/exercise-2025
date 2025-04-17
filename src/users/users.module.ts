import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersConfig } from './users.config';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, UsersConfig],
})
export class UsersModule {}

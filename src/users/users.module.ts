import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersConfig } from './users.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  // inside this module, we can inject other modules
  providers: [UsersService, UsersConfig],
  // outside this module, for other module use eg. auth
  exports: [UsersService],
})
export class UsersModule {}

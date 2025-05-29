import { Module } from '@nestjs/common';
import { VertupayService } from './vertupay.service';
import { VertupayAccountFactory } from './vertupay.account-factory';
import { ConfigModule } from '@nestjs/config';
import { VertupayController } from './vertupay.controller';
import { VertupayApiClient } from './vertupay.api-client';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vertupay } from './entities/vertupay.entity';

@Module({
  imports: [ConfigModule, HttpModule, TypeOrmModule.forFeature([Vertupay])],
  providers: [VertupayService, VertupayAccountFactory, VertupayApiClient],
  controllers: [VertupayController],
})
export class VertupayModule {}

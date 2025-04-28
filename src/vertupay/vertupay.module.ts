import { Module } from '@nestjs/common';
import { VertupayService } from './vertupay.service';
import { VertupayAccountFactory } from './vertupay.account-factory';
import { ConfigModule } from '@nestjs/config';
import { VertupayController } from './vertupay.controller';
import { VertupayApiClient } from './vertupay.api-client';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [VertupayService, VertupayAccountFactory, VertupayApiClient],
  controllers: [VertupayController],
})
export class VertupayModule {}

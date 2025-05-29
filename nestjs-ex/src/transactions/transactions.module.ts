import { Module } from '@nestjs/common';
import { PayVertupayListener } from './listeners/pay.vertupay.listener';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions.entity';
import { TransactionsService } from './transactions.service';
import { BullModule } from '@nestjs/bullmq';
import { TransactionsProcessor } from './transactions.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions]),
    BullModule.registerQueue({
      name: 'transaction',
    }),
  ],
  providers: [PayVertupayListener, TransactionsService, TransactionsProcessor],
})
export class TransactionsModule {}

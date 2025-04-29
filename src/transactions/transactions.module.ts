import { Module } from '@nestjs/common';
import { PayVertupayListener } from './listeners/pay.vertupay.listener';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions.entity';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transactions])],
  providers: [PayVertupayListener, TransactionsService],
})
export class TransactionsModule {}

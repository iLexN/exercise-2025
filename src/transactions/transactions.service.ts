import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactions } from './entities/transactions.entity';
import { Vertupay } from '../vertupay/entities/vertupay.entity';
import { PaymentStatus } from './payment.type';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
  ) {}

  async findOneByPaymentId(id: string) {
    return await this.transactionsRepository.findOneBy({
      payment_id: id,
    });
  }

  async create(transaction: Transactions) {
    return await this.transactionsRepository.insert(transaction);
  }

  async save(transaction: Transactions) {
    await this.transactionsRepository.save(transaction);
  }

  convertFromVertupayToTransaction(
    transactions: Transactions,
    vertupay: Vertupay,
  ) {
    let status: PaymentStatus;

    switch (vertupay.transaction_status) {
      case 'SUCCESS':
        status = PaymentStatus.Completed;
        break;
      default:
        status = PaymentStatus.Failed;
    }

    const formattedDateString = vertupay.date_request.replace(/\//g, '-');
    const date = new Date(formattedDateString);
    console.log(date);

    transactions.payment_id = vertupay.transaction_id;
    transactions.status = status;
    transactions.amount = vertupay.amount;
    transactions.transaction_at = date;
    transactions.currency = vertupay.currency;
    transactions.payment_type = vertupay.payment_type;
    transactions.order_no = vertupay.merchant_transaction_id;

    return transactions;
  }
}

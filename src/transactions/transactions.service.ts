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

  async findOneByPaymentId(id: string): Promise<Transactions | null> {
    try {
      return await this.transactionsRepository.findOneBy({ payment_id: id });
    } catch (error) {
      console.error('Error finding transaction by payment ID:', error);
      throw new Error('Could not find transaction');
    }
  }

  async create(transaction: Transactions): Promise<void> {
    try {
      await this.transactionsRepository.insert(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Transaction creation failed');
    }
  }

  async save(transaction: Transactions): Promise<void> {
    try {
      await this.transactionsRepository.save(transaction);
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw new Error('Transaction could not be saved');
    }
  }

  convertFromVertupayToTransaction(
    transactions: Transactions,
    vertupay: Vertupay,
  ) {
    const status =
      vertupay.transaction_status === 'SUCCESS'
        ? PaymentStatus.Completed
        : PaymentStatus.Failed;

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

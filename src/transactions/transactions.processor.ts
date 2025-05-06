import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Vertupay } from '../vertupay/entities/vertupay.entity';
import { plainToInstance } from 'class-transformer';
import { TransactionsService } from './transactions.service';
import { Transactions } from './entities/transactions.entity';

@Processor('transaction')
export class TransactionsProcessor extends WorkerHost {
  private readonly logger = new Logger(TransactionsProcessor.name);

  constructor(private readonly transactionsService: TransactionsService) {
    super();
  }
  async process(job: Job): Promise<void> {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.name);

    switch (job.name) {
      case 'fromVertupay': {
        const vertupay = plainToInstance(Vertupay, job.data);
        await this.vertupayUpsertTransaction(vertupay);
        break;
      }
      case 'dummy': {
        this.logger.log('dummy');
        break;
      }
      default: {
        this.logger.error(`job name not match: ${job.name}`);
        break;
      }
    }
  }

  async vertupayUpsertTransaction(vertupay: Vertupay) {
    let dbRow;

    try {
      dbRow = await this.transactionsService.findOneByPaymentId(
        vertupay.transaction_id,
      );
    } catch (findError) {
      console.error('Error finding transaction by payment ID:', findError);
      return;
    }

    if (!dbRow) {
      // insert
      console.warn(
        `Transaction with ID ${vertupay.transaction_id} not found for update.`,
      );
      try {
        const newTransaction =
          this.transactionsService.convertFromVertupayToTransaction(
            new Transactions(),
            vertupay,
          );
        await this.transactionsService.create(newTransaction);
        console.log(`Transaction created for ID: ${vertupay.transaction_id}`);
      } catch (error) {
        console.error('Error handling Vertupay create event:', error);
      }
      return;
    }

    // update
    const updatedTransaction =
      this.transactionsService.convertFromVertupayToTransaction(
        dbRow,
        vertupay,
      );
    console.log(updatedTransaction.ping());
    try {
      await this.transactionsService.save(updatedTransaction);
      console.log(`Transaction updated for ID: ${vertupay.transaction_id}`);
    } catch (saveError) {
      console.error('Error saving updated transaction:', saveError);
    }
  }
}

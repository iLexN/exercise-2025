import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VertupayListEvents } from '../../vertupay/events/vertupay.events';
import { VertupayPayUpdatedEvent } from '../../vertupay/events/vertupay.pay-updated.event';
import { TransactionsService } from '../transactions.service';
import { VertupayPayCreatedEvent } from '../../vertupay/events/vertupay.pay-created.event';
import { Transactions } from '../entities/transactions.entity';

@Injectable()
export class PayVertupayListener {
  constructor(private readonly transactionsService: TransactionsService) {}
  @OnEvent(VertupayListEvents.Update)
  async handleVertupayUpdatedEvent(event: VertupayPayUpdatedEvent) {
    const vertupay = event.pay;

    const dbRow = await this.transactionsService.findOneByPaymentId(
      vertupay.transaction_id,
    );
    if (!dbRow) {
      return;
    }

    const newTransaction =
      this.transactionsService.convertFromVertupayToTransaction(
        dbRow,
        vertupay,
      );
    await this.transactionsService.save(newTransaction);
  }

  @OnEvent(VertupayListEvents.Create)
  async handleVertupayCreatedEvent(event: VertupayPayCreatedEvent) {
    const transaction =
      this.transactionsService.convertFromVertupayToTransaction(
        new Transactions(),
        event.pay,
      );

    await this.transactionsService.create(transaction);
  }
}

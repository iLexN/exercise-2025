import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { VertupayListEvents } from '../../vertupay/events/vertupay.events';
import { VertupayPayUpdatedEvent } from '../../vertupay/events/vertupay.pay-updated.event';
import { TransactionsService } from '../transactions.service';
import { VertupayPayCreatedEvent } from '../../vertupay/events/vertupay.pay-created.event';

@Injectable()
export class PayVertupayListener {
  constructor(private readonly transactionsService: TransactionsService) {}

  @OnEvent(VertupayListEvents.Update)
  async handleVertupayUpdatedEvent(
    event: VertupayPayUpdatedEvent,
  ): Promise<void> {
    await this.transactionsService.addToQueueFromVertupay(event.pay);

    // let dbRow;
    //
    // try {
    //   dbRow = await this.transactionsService.findOneByPaymentId(
    //     vertupay.transaction_id,
    //   );
    // } catch (findError) {
    //   console.error('Error finding transaction by payment ID:', findError);
    //   return;
    // }
    //
    // if (!dbRow) {
    //   console.warn(
    //     `Transaction with ID ${vertupay.transaction_id} not found for update.`,
    //   );
    //   await this.handleVertupayCreatedEvent(
    //     new VertupayPayUpdatedEvent(vertupay),
    //   );
    //   return;
    // }
    //
    // const updatedTransaction =
    //   this.transactionsService.convertFromVertupayToTransaction(
    //     dbRow,
    //     vertupay,
    //   );
    // console.log(updatedTransaction.ping());
    // try {
    //   await this.transactionsService.save(updatedTransaction);
    //   console.log(`Transaction updated for ID: ${vertupay.transaction_id}`);
    // } catch (saveError) {
    //   console.error('Error saving updated transaction:', saveError);
    // }
  }

  @OnEvent(VertupayListEvents.Create)
  async handleVertupayCreatedEvent(
    event: VertupayPayCreatedEvent,
  ): Promise<void> {
    await this.transactionsService.addToQueueFromVertupay(event.pay);

    // try {
    //   const newTransaction =
    //     this.transactionsService.convertFromVertupayToTransaction(
    //       new Transactions(),
    //       event.pay,
    //     );
    //   await this.transactionsService.create(newTransaction);
    //   console.log(`Transaction created for ID: ${event.pay.transaction_id}`);
    // } catch (error) {
    //   console.error('Error handling Vertupay create event:', error);
    // }
  }
}

import { Injectable } from '@nestjs/common';
import { VertupayAccountFactory } from './vertupay.account-factory';
import { VertupayAccountDto } from './struct/vertupay.account.dto';
import { VertupayApiClient } from './vertupay.api-client';
import { VertupayAccountBalanceDto } from './struct/vertupay.account-balance.dto';
import { ApiListRow } from './struct/vertupay.pay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vertupay } from './entities/vertupay.entity';
import { In } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VertupayListEvents } from './events/vertupay.events';
import { VertupayPayUpdatedEvent } from './events/vertupay.pay-updated.event';
import { VertupayPayCreatedEvent } from './events/vertupay.pay-created.event'; // Ensure you import In if using TypeORM

@Injectable()
export class VertupayService {
  constructor(
    private readonly vertupayAccountFactory: VertupayAccountFactory,
    private readonly vertupayApiClient: VertupayApiClient,
    @InjectRepository(Vertupay)
    private vertupayRepository: Repository<Vertupay>,
    private eventEmitter: EventEmitter2,
  ) {}

  getAccounts(): VertupayAccountDto[] {
    return this.vertupayAccountFactory.createAccounts();
  }

  async getBalance(
    account: VertupayAccountDto,
  ): Promise<VertupayAccountBalanceDto> {
    return await this.vertupayApiClient.getBalance(account);
  }

  async getPayoutList(
    account: VertupayAccountDto,
    start: Date,
    end: Date,
  ): Promise<ApiListRow[]> {
    return await this.vertupayApiClient.getPayoutList(account, start, end);
  }

  async upsertPaylist(list: ApiListRow[]) {
    // Extract transaction IDs from the input list
    const transactionIds = list.map((row: ApiListRow) => row.transactionID);

    // Fetch existing rows from the database
    const dbRows = await this.vertupayRepository.find({
      where: {
        transaction_id: In(transactionIds),
      },
    });

    // Create a map for quick lookup of existing rows
    const existingRowsMap = new Map(
      dbRows.map((row: Vertupay) => [row.transaction_id, row]),
    );

    // Prepare arrays for updates and inserts
    const toUpdate: Vertupay[] = [];
    const toInsert: Vertupay[] = [];

    for (const item of list) {
      if (existingRowsMap.has(item.transactionID)) {
        // Update case
        const dbRow = existingRowsMap.get(item.transactionID);
        if (dbRow) {
          dbRow.updateFromApiListRow(item); // Update fields
          toUpdate.push(dbRow);
        }
      } else {
        // Insert case
        toInsert.push(Vertupay.fromApiListRow(item));
      }
    }

    // Perform batch updates and inserts
    if (toUpdate.length > 0) {
      console.log(`-------------- toUpdate: ${toUpdate.length}`);
      await this.vertupayRepository.save(toUpdate);
      toUpdate.forEach((row: Vertupay) =>
        this.eventEmitter.emit(
          VertupayListEvents.Update,
          new VertupayPayUpdatedEvent(row),
        ),
      );
    }

    if (toInsert.length > 0) {
      console.log(`-------------- toInsert: ${toInsert.length}`);
      await this.vertupayRepository.insert(toInsert);
      toInsert.forEach((row: Vertupay) =>
        this.eventEmitter.emit(
          VertupayListEvents.Create,
          new VertupayPayCreatedEvent(row),
        ),
      );
    }
    // insert() can batch vs save() is one by one
    // await this.vertupayRepository.insert(rows);
  }
}

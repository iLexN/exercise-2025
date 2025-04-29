import { Injectable } from '@nestjs/common';
import { VertupayAccountFactory } from './vertupay.account-factory';
import { VertupayAccountDto } from './struct/vertupay.account.dto';
import { VertupayApiClient } from './vertupay.api-client';
import { VertupayAccountBalanceDto } from './struct/vertupay.account-balance.dto';
import { ApiListRow } from './struct/vertupay.pay.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vertupay } from './entities/vertupay.entity';
import { In } from 'typeorm'; // Ensure you import In if using TypeORM

@Injectable()
export class VertupayService {
  constructor(
    private readonly vertupayAccountFactory: VertupayAccountFactory,
    private readonly vertupayApiClient: VertupayApiClient,
    @InjectRepository(Vertupay)
    private vertupayRepository: Repository<Vertupay>,
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

  async createManyPay(list: ApiListRow[]) {
    // find all row from the db where from apiListRow.transactionID
    const transactionIds = list.map((row: ApiListRow) => row.transactionID);
    const dbRows = await this.vertupayRepository.find({
      where: {
        transaction_id: In(transactionIds),
      },
    });
    const existingRowsMap = new Map(
      dbRows.map((row: Vertupay): [string, Vertupay] => [
        row.transaction_id,
        row,
      ]),
    );
    // Prepare arrays for updates and inserts
    const toUpdate: Vertupay[] = [];
    const toInsert: Vertupay[] = [];

    for (const item of list) {
      if (existingRowsMap.has(item.transactionID)) {
        // update case
        const dbRow = existingRowsMap.get(item.transactionID);
        if (dbRow !== undefined) {
          dbRow?.updateFromApiListRow(item);
          toUpdate.push(dbRow);
        }
      } else {
        toInsert.push(Vertupay.fromApiListRow(item));
      }
    }

    if (toUpdate.length > 0) {
      console.log(`-------------- toupdate: ${toUpdate.length}`);
      await this.vertupayRepository.save(toUpdate);
    }
    if (toInsert.length > 0) {
      console.log(`-------------- toinsert: ${toInsert.length}`);
      await this.vertupayRepository.insert(toInsert);
    }
    // insert() can batch vs save() is one by one
    // await this.vertupayRepository.insert(rows);
  }
}

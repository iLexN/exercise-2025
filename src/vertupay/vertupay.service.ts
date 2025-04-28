import { Injectable } from '@nestjs/common';
import { VertupayAccountFactory } from './vertupay.account-factory';
import { VertupayAccount } from './struct/vertupay.account';
import { VertupayBalanceResponse } from './struct/vertupay.balance-response';
import { VertupayApiClient } from './vertupay.api-client';

@Injectable()
export class VertupayService {
  constructor(
    private readonly vertupayAccountFactory: VertupayAccountFactory,
    private readonly vertupayApiClient: VertupayApiClient,
  ) {}

  getAccounts(): VertupayAccount[] {
    return this.vertupayAccountFactory.createAccounts();
  }

  async getBalance(account: VertupayAccount): Promise<VertupayBalanceResponse> {
    return await this.vertupayApiClient.getBalance(account);
  }
}

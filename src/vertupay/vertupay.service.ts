import { Injectable } from '@nestjs/common';
import { VertupayAccountFactory } from './vertupay.account-factory';
import { VertupayAccountDto } from './struct/vertupay.account.dto';
import { VertupayApiClient } from './vertupay.api-client';
import { VertupayAccountBalanceDto } from './struct/vertupay.account-balance.dto';

@Injectable()
export class VertupayService {
  constructor(
    private readonly vertupayAccountFactory: VertupayAccountFactory,
    private readonly vertupayApiClient: VertupayApiClient,
  ) {}

  getAccounts(): VertupayAccountDto[] {
    return this.vertupayAccountFactory.createAccounts();
  }

  async getBalance(
    account: VertupayAccountDto,
  ): Promise<VertupayAccountBalanceDto> {
    return await this.vertupayApiClient.getBalance(account);
  }
}

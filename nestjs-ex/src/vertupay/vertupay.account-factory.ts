import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VertupayAccountDto } from './struct/vertupay.account.dto';

@Injectable()
export class VertupayAccountFactory {
  constructor(private configService: ConfigService) {}

  createAccounts(): VertupayAccountDto[] {
    const accounts = [];
    const accountConfigs = [
      { id: '4D9C07532E', passKey: 'VERTUPAY_P2P_PASS' },
      { id: '02A9BA0EA9', passKey: 'VERTUPAY_QRIS_PASS' },
      { id: '320A86AF63', passKey: 'VERTUPAY_VA_PASS' },
    ];

    for (const { id, passKey } of accountConfigs) {
      const account = new VertupayAccountDto(
        id,
        this.configService.get<string>(passKey, ''),
      );
      accounts.push(account);
    }
    return accounts;
  }
}

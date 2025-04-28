import { Injectable } from '@nestjs/common';
import { VertupayAccount } from './struct/vertupay.account';
import { createHash } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { VertupayEndpoints } from './struct/vertupay.endpoints';
import { VertupayApiError } from './VertupayApiError';
import {
  VertupayBalanceResponse,
  VertupayFundInOut,
} from './struct/vertupay.balance-response';
import { AxiosError } from 'axios';

@Injectable()
export class VertupayApiClient {
  constructor(private readonly httpService: HttpService) {}

  async getBalance(account: VertupayAccount): Promise<VertupayBalanceResponse> {
    console.log(account);
    const signature: string = this.hashSignature(account.getSignatureString());
    console.log(signature);

    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      MerchantID: account.merchantId,
      Signature: signature,
    };

    try {
      const { data: response } = await firstValueFrom(
        this.httpService.post<VertupayBalanceResponse>(
          VertupayEndpoints.PAYIN_BALANCE,
          data,
          {
            headers,
          },
        ),
      );

      // the response look like a class,
      // but it is plain object,
      // cannot use response.isSuccess().
      console.log(response);
      // return response;

      // so need create class.
      return new VertupayBalanceResponse(
        new VertupayFundInOut(
          response.Content.BalanceFundIn,
          response.Content.BalanceFundOut,
        ),
        response.ResultCode,
        response.ErrorMessage,
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      const status: number = axiosError.status ?? 500;
      throw new VertupayApiError(`VertupayApiError: status ${status}`);
    }
  }

  hashSignature(signatureString: string) {
    console.log(signatureString);
    const hash = createHash('sha512');
    hash.update(signatureString);
    return hash.digest('hex').toUpperCase(); // Convert to uppercase
  }
}

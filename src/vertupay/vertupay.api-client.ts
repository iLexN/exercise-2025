import { Injectable } from '@nestjs/common';
import { VertupayAccountDto } from './struct/vertupay.account.dto';
import { createHash } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { VertupayEndpoints } from './struct/vertupay.endpoints';
import { VertupayApiError } from './VertupayApiError';
import { VertupayBalanceResponse } from './struct/vertupay.balance-response';
import { AxiosError } from 'axios';
import { VertupayAccountBalanceDto } from './struct/vertupay.account-balance.dto';
import { ApiListRow } from './struct/vertupay.pay.dto';
import { ListRow, VertupayListResponse } from './struct/vertypay.list-response';
import { VertupayPaymentType } from './struct/vertupay.payment-type';

@Injectable()
export class VertupayApiClient {
  constructor(private readonly httpService: HttpService) {}

  async getBalance(
    account: VertupayAccountDto,
  ): Promise<VertupayAccountBalanceDto> {
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
      return VertupayAccountBalanceDto.createFromApiResponse(response);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status: number = axiosError.status ?? 500;
      throw new VertupayApiError(
        `VertupayApiError getBalance: status ${status}`,
      );
    }
  }

  async getPayoutList(
    account: VertupayAccountDto,
    start: Date,
    end: Date,
    list: ApiListRow[] = [],
    page: number = 1,
  ): Promise<ApiListRow[]> {
    const signature: string = this.hashSignature(account.getSignatureString());
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      MerchantID: account.merchantId,
      Signature: signature,
      DateStart: start.toISOString(),
      DateEnd: end.toISOString(),
      Page: page,
    };

    try {
      const { data: response } = await firstValueFrom(
        this.httpService.post<VertupayListResponse>(
          VertupayEndpoints.PAYOUT_LIST,
          data,
          { headers },
        ),
      );

      const { Content: body } = response;
      // for (const data of body.Data) {
      //   list.push(
      //     ApiListRow.createFromApiResponse(data, VertupayPaymentType.Withdraw),
      //   );
      // }
      const apiRows: ApiListRow[] = body.Data.map(
        (data: ListRow): ApiListRow =>
          ApiListRow.createFromApiResponse(data, VertupayPaymentType.Withdraw),
      );
      list.push(...apiRows);

      if (this.hasNextPage(body.Page, body.TotalRows)) {
        return await this.getPayoutList(account, start, end, list, page + 1);
      }

      return list;
    } catch (error) {
      const axiosError = error as AxiosError;
      const status: number = axiosError.status ?? 500;
      throw new VertupayApiError(
        `VertupayApiError getPayoutList: status ${status}`,
      );
    }
  }

  hashSignature(signatureString: string) {
    console.log(signatureString);
    const hash = createHash('sha512');
    hash.update(signatureString);
    return hash.digest('hex').toUpperCase(); // Convert to uppercase
  }

  hasNextPage(pageNo: number, totalRows: number): boolean {
    const rowPerPage = 100;
    const totalPages = Math.ceil(totalRows / rowPerPage);
    return pageNo < totalPages;
  }
}

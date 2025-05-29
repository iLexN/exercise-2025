import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { VertupayService } from './vertupay.service';
import { ResponseCode } from '../utility/response.message.code';
import { VertupayApiError } from './VertupayApiError';
import { VertupayAccountBalanceDto } from './struct/vertupay.account-balance.dto';
import { ApiListRow } from './struct/vertupay.pay.dto';
import { VertupayAccountDto } from './struct/vertupay.account.dto';

@Controller('vertupay')
export class VertupayController {
  constructor(private readonly vertupayService: VertupayService) {}

  @Get()
  async getBalance() {
    const accounts = this.vertupayService.getAccounts();

    try {
      const balance: VertupayAccountBalanceDto =
        await this.vertupayService.getBalance(accounts[0]);
      console.log(balance);
      console.log(typeof balance);
      return {
        success: true,
        message: `Balance found success.`,
        data: balance.all(),
        code: ResponseCode.SUCCESS,
      };
    } catch (error) {
      const customError = error as VertupayApiError;
      throw new HttpException(
        {
          success: false,
          message: customError.message,
          code: ResponseCode.ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/payout')
  async getPayoutList() {
    const accounts: VertupayAccountDto[] = this.vertupayService.getAccounts();
    const end = new Date();
    const start = new Date(end.getTime() - 2 * 24 * 60 * 60 * 1000);
    let payoutList: ApiListRow[];
    try {
      payoutList = await this.vertupayService.getPayoutList(
        accounts[0],
        start,
        end,
      );
    } catch (error) {
      const customError = error as VertupayApiError;
      throw new HttpException(
        {
          success: false,
          message: customError.message,
          code: ResponseCode.ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await this.vertupayService.upsertPaylist(payoutList);
      return {
        success: true,
        message: `Payout List successful.`,
        data: payoutList,
        code: ResponseCode.SUCCESS,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          success: false,
          message: 'db error',
          code: ResponseCode.ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { VertupayService } from './vertupay.service';
import { ResponseCode } from '../utility/response.message.code';
import { VertupayApiError } from './VertupayApiError';
import { VertupayAccountBalanceDto } from './struct/vertupay.account-balance.dto';

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
}

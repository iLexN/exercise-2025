import { VertupayBalanceResponse } from './vertupay.balance-response';

export class VertupayAccountBalanceDto {
  constructor(
    public readonly fundIn: number,
    public readonly fundOut: number,
  ) {}

  getBalance(): number {
    return this.fundIn + this.fundOut;
  }

  all() {
    return {
      in: this.fundIn,
      out: this.fundOut,
      total: this.getBalance(),
    };
  }

  static createFromApiResponse(
    vertupayBalanceResponse: VertupayBalanceResponse,
  ): VertupayAccountBalanceDto {
    return new VertupayAccountBalanceDto(
      vertupayBalanceResponse.Content.BalanceFundIn,
      vertupayBalanceResponse.Content.BalanceFundOut,
    );
  }
}

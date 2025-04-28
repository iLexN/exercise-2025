export class VertupayBalanceResponse {
  constructor(
    public readonly Content: VertupayFundInOut,
    public readonly ResultCode: number,
    public readonly ErrorMessage: string,
  ) {}

  isSuccess(): boolean {
    return this.ResultCode === 1;
  }
}

export class VertupayFundInOut {
  constructor(
    public readonly BalanceFundIn: number,
    public readonly BalanceFundOut: number,
  ) {}

  getBalance(): number {
    return this.BalanceFundIn + this.BalanceFundOut;
  }

  all() {
    return {
      BalanceFundIn: this.BalanceFundIn,
      BalanceFundOut: this.BalanceFundOut,
      total: this.getBalance(),
    };
  }
}

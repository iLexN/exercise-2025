export interface VertupayBalanceResponse {
  Content: VertupayFundInOut;
  ResultCode: number;
  ErrorMessage: string;
}

export interface VertupayFundInOut {
  BalanceFundIn: number;
  BalanceFundOut: number;
}

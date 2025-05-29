export interface VertupayListResponse {
  Content: ListContent;
  ResultCode: number;
  ErrorMessage: string;
}

export interface ListContent {
  Page: number;
  TotalRows: number;
  Data: ListRow[];
}

export interface ListRow {
  MerchantTransactionID: string;
  MerchantID: string;
  TransactionID: string;
  Currency: string;
  Amount: number;
  DateRequest: string;
  TransactionStatus: string;
  BankCode: string;
  BankName: string;
  BankAccountNo: string;
  BankAccountName: string;
  BankBranch: string;
  BankCity: string;
  BankProvince: string;
}

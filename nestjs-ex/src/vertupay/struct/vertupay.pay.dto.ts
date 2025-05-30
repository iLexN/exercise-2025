import { ListRow } from './vertypay.list-response';
import { PaymentType } from '../../transactions/payment.type';

export class ApiListRow {
  constructor(
    public readonly merchantTransactionID: string,
    public readonly merchantID: string,
    public readonly transactionID: string,
    public readonly currency: string,
    public readonly amount: number,
    public readonly dateRequest: string,
    public readonly transactionStatus: string,
    public readonly paymentType: PaymentType,
    public readonly accountName: string,
  ) {}

  static createFromApiResponse(
    data: ListRow,
    paymentType: PaymentType,
  ): ApiListRow {
    return new ApiListRow(
      data.MerchantTransactionID,
      data.MerchantID,
      data.TransactionID,
      data.Currency,
      data.Amount,
      data.DateRequest,
      data.TransactionStatus,
      paymentType,
      data.BankAccountName ?? '',
    );
  }
}

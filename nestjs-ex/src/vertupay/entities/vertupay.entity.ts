import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiListRow } from '../struct/vertupay.pay.dto';
import { PaymentType } from '../../transactions/payment.type';

@Entity()
export class Vertupay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  merchant_transaction_id: string;

  @Column()
  merchant_id: string;
  @Column()
  transaction_id: string;
  @Column()
  currency: string;
  @Column()
  amount: number;
  @Column()
  date_request: string;
  @Column()
  transaction_status: string;
  @Column()
  payment_type: PaymentType;
  @Column()
  account_name: string;

  ping(): string {
    return 'pong';
  }

  updateFromApiListRow(apiListRow: ApiListRow) {
    this.merchant_transaction_id = apiListRow.merchantTransactionID;
    this.merchant_id = apiListRow.merchantID;
    this.transaction_id = apiListRow.transactionID;
    this.currency = apiListRow.currency;
    this.amount = apiListRow.amount;
    this.date_request = apiListRow.dateRequest;
    this.transaction_status = apiListRow.transactionStatus;
    this.payment_type = apiListRow.paymentType;
    this.account_name = apiListRow.accountName;
  }
  static fromApiListRow(apiListRow: ApiListRow): Vertupay {
    const vertupay = new Vertupay();
    vertupay.merchant_transaction_id = apiListRow.merchantTransactionID;
    vertupay.merchant_id = apiListRow.merchantID;
    vertupay.transaction_id = apiListRow.transactionID;
    vertupay.currency = apiListRow.currency;
    vertupay.amount = apiListRow.amount;
    vertupay.date_request = apiListRow.dateRequest;
    vertupay.transaction_status = apiListRow.transactionStatus;
    vertupay.payment_type = apiListRow.paymentType;
    vertupay.account_name = apiListRow.accountName;

    return vertupay;
  }
}

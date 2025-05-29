import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentStatus, PaymentType } from '../payment.type';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payment_id: string;

  @Column()
  payment_type: PaymentType;

  @Column({
    type: 'double',
  })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'timestamp' })
  transaction_at: Date;

  @Column()
  status: PaymentStatus;

  @Column()
  order_no: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  ping(): string {
    return 'pong';
  }
}

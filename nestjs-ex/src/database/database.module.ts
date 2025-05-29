import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import * as process from 'node:process';
import { Vertupay } from '../vertupay/entities/vertupay.entity';
import { Transactions } from '../transactions/entities/transactions.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [User, Vertupay, Transactions],
      synchronize: process.env.NODE_ENV === 'local', // set to false in production
      logging: true,
    }),
  ],
})
export class DatabaseModule {}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseCredentials } from './database.credentials.class';

@Injectable()
export class UsersConfig {
  readonly db: DatabaseCredentials;

  constructor(private configService: ConfigService) {
    this.db = new DatabaseCredentials(
      configService.get<string>('DATABASE_USER', ''),
      configService.get<string>('DATABASE_PASSWORD', ''),
    );
  }
}

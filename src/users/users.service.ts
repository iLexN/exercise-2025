import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { DatabaseCredentials } from './database-credentials.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private db: DatabaseCredentials;

  constructor(private configService: ConfigService) {
    this.db = {
      DATABASE_USER: this.configService.get<string>('DATABASE_USER') || '',
      DATABASE_PASSWORD:
        this.configService.get<string>('DATABASE_PASSWORD') || '',
    };
  }
  create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action adds a new user';
  }

  findAll() {
    this.logger.log('findAll');
    this.logger.log('db', this.db);
    return `This action returns all users`;
  }

  findOne(id: number) {
    // this creates 2 log message
    // example output
    // nest-app-1  | {"level":"log","pid":301,"timestamp":1744794310853,"message":"this is findOne","context":"UsersService"}
    // nest-app-1  | {"level":"log","pid":301,"timestamp":1744794310853,"message":{"id":4433},"context":"UsersService"}
    this.logger.log(`this is findOne`, { id: id });
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

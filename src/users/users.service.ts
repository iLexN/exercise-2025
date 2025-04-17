import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersConfig } from './users.config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private usersConfig: UsersConfig) {}
  create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return 'This action adds a new user';
  }

  findAll() {
    this.logger.log('findAll');
    this.logger.log('db', this.usersConfig.db.DATABASE_USER);
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
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

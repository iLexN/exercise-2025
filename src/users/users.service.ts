import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersConfig } from './users.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private usersConfig: UsersConfig,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // method #1
    // const user = this.usersRepository.create(createUserDto); // Create a new user instance
    // await this.usersRepository.save(user); // Save the user to the database

    // method #2
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.age = createUserDto.age;
    user.roles = createUserDto.roles;
    await this.usersRepository.save(user);

    return user;
  }

  findAll() {
    this.logger.log('findAll');
    this.logger.log('db', this.usersConfig.db.DATABASE_USER);
    return this.usersRepository.find();
  }

  findOne(id: number) {
    // this creates 2 log message
    // example output
    // nest-app-1  | {"level":"log","pid":301,"timestamp":1744794310853,"message":"this is findOne","context":"UsersService"}
    // nest-app-1  | {"level":"log","pid":301,"timestamp":1744794310853,"message":{"id":4433},"context":"UsersService"}
    this.logger.log(`this is findOne`, { id: id });
    return this.usersRepository.findOneBy({ id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

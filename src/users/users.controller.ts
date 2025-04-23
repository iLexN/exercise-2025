import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseCode } from '../utility/response.message.code';
import { FindAllUserDto } from './dto/find-all-user.dto';
import { CACHE_MANAGER, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return {
      success: true,
      message: `User created successfully`,
      data: user,
      code: ResponseCode.SUCCESS,
    };
  }

  @Get()
  async findAll(@Query() findAllUserDto: FindAllUserDto) {
    this.logger.log('findAll', findAllUserDto);

    let users = await this.cacheManager.get('users.findAll');

    if (users === null) {
      this.logger.log('cache miss');
      users = await this.usersService.findAll();

      await this.cacheManager.set('users.findAll', users, 1000 * 60);
    }

    return {
      success: true,
      message: `User found all success.`,
      data: users,
      code: ResponseCode.SUCCESS,
    };
  }
  // @CacheKey('custom_key')
  @Get(':id')
  @CacheTTL(1000 * 60)
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);

    if (user === null) {
      throw new HttpException(
        {
          success: false,
          message: `User not found`,
          code: ResponseCode.ERROR,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      message: `User created successfully`,
      data: user,
      code: ResponseCode.SUCCESS,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

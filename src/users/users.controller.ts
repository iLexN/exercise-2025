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
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseCode } from '../utility/response.message.code';
import { FindAllUserDto } from './dto/find-all-user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

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
  findAll(@Query() findAllUserDto: FindAllUserDto) {
    this.logger.log('findAll', findAllUserDto);
    return this.usersService.findAll();
  }

  @Get(':id')
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

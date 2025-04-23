import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  //async validateUser(username: string, pass: string): Promise<User | null> {
  async validateUser(username: string): Promise<User | null> {
    const user = await this.usersService.findByName(username);

    if (user) {
      // const { password, ...result } = user;
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload = { user: user, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}

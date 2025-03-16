import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findOne(username, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    const { password: pw, ...userInfo } = user.toObject();
    return {
      access_token: this.jwtService.sign(userInfo),
    };
  }
}

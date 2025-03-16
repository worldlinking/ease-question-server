import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    return await this.userService.register(userData);
  }

  @Get('info')
  @Redirect('/api/auth/profile', 302)
  async info() {
    return;
  }

  @Public()
  @Post('login')
  @Redirect('/api/auth/login', 307)
  async login() {
    return;
  }
}

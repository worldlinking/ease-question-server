import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() userInfo: CreateUserDto) {
    const { username, password } = userInfo;
    return await this.authService.login(username, password);
  }

  @Get('profile')
  async profile(@Request() req) {
    return req.user;
  }
}

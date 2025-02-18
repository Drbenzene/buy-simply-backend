import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginWithPasswordDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async create(
    @Body() loginDto: LoginWithPasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const res = await this.authService.login(loginDto);
    response.cookie('token', res.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    const res = await this.authService.logOutUser(response.req.session);
    response.clearCookie('token');
    return res;
  }
}

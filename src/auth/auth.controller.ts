import { Controller, Post, Body, Get, Query, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto }  from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() registerDto: RegisterDto) {
    return await this.authService.create(registerDto);
  }

  @Get('confirm')
  async confirmEmail(@Query('token') token: string) {
    console.log("link")
    const user = await this.authService.findByConfirmationToken(token);
    return user;
  }
/*
  @Get('success')
  confirmed() {
    return 'Email confirmed successfully. You can now log in.';
  }
  */
}

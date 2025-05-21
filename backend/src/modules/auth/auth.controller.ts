import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { Response as ResponseObj } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>, @Response() response: ResponseObj) {
    return this.authService.signIn(signInDto.email, signInDto.password, response);
  }

  @Get('profile')
  getProfile(@Request() req: Request) {
    //@ts-ignore
    return req.user;
  }
}

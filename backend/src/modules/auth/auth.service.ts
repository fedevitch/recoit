import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response as ResponseObj } from 'express';
import { COOKIE_NAME } from 'src/constants';
import { SecurityService } from '../security/security.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService, 
    private securityService: SecurityService) {

    }

  async signIn(email: string, password: string, response: ResponseObj): Promise<any> {
    const user = await this.usersService.getUser({ email });
    if (!user?.password || !this.securityService.isPasswordCorrect(password, user.password)) {
      throw new UnauthorizedException();
    }

    const { id } = user;
    
    const payload = { id, email };
    const cookie = await this.jwtService.signAsync(payload);
    response.cookie(COOKIE_NAME, cookie);
    response.status(HttpStatus.ACCEPTED);
    response.send();    
  }
}

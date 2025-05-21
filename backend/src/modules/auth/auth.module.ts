
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../constants';
import { UserModule } from '../user/user.module';
import { SecurityService } from '../security/security.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    }),
    UserModule
  ],
  providers: [
    AuthService,
    SecurityService
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}


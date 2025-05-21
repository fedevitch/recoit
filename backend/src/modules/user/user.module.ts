import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UsersService } from './user.service';
import { PrismaService } from '../../db/prisma.service';
import { SecurityService } from '../security/security.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    PrismaService,
    SecurityService, 
    UsersService
  ],
  exports: [UsersService]
})
export class UserModule {}
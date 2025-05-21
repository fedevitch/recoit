import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from './modules/main/main.module';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './db/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { AuthModule } from './modules/auth/auth.module';

const envFilePath = `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`;

@Module({
  imports: [ConfigModule.forRoot({ envFilePath }), MainModule, AuthModule, UserModule],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}

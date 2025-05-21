import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from './constants';
import { AppGuard } from './app.guard';
import { DbModule } from './db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CanLog, CanLogSchema } from './db/canlog.schema';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    DbModule,
    MongooseModule.forFeature([{ name: CanLog.name, schema: CanLogSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    }
  ],
})
export class AppModule {}

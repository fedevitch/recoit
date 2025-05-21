import { Injectable } from '@nestjs/common';
import { ICanLogDto } from './dtos/canLog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CanLog } from './db/canlog.schema';
import { Model } from 'mongoose';

@Injectable()
export class AppService {
  constructor(@InjectModel(CanLog.name) private canLogModel: Model<CanLog>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async handleCanLogs(data: ICanLogDto) {
    const canLogItem = new this.canLogModel(data);
    return canLogItem.save();
  }
}

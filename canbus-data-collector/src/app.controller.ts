import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ICanLogDto } from './dtos/canLog.dto';
import { AppGuard } from './app.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AppGuard)
  @Post('log')
  canLog(@Body() data: ICanLogDto) {
    return this.appService.handleCanLogs(data);    
  }
}

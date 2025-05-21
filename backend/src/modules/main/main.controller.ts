import { Controller, Get } from '@nestjs/common';
import { MainService } from './main.service';

@Controller()
export class MainController {
  constructor(private readonly appService: MainService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

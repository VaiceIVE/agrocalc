import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('calc')
  calculate(@Body() data: Record<string, any>) {
    return this.appService.calculate(data)
  }

  @Post('document')
  getDocument(@Body() data: Record<string, any>)
  {
    return this.appService.createDocument(data)
  }

}

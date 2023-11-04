import { Body, Controller, Get, Header, Post, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as fs from "fs";
import { Readable } from 'stream';
import { encode } from 'punycode';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('calc')
  calculate(@Body() data: Record<string, any>) {
    return this.appService.calculate(data)
  }

  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, charset=utf8')
  @Header('Content-Disposition', 'attachment; filename="myfile.docx"')
  @Post('document')
  async getDocument(@Body() data: Record<string, any>, @Res({ passthrough: true }) res: Response)
  {
    const file = await this.appService.createDocument(data)

    console.log(file)

    //const file = fs.createReadStream("myfile.docx", "utf-8");
    
    //const stream = res.writeHead(200)
    //file.on('data', (chunk) => stream.write(chunk));
    //file.on('end', () => stream.end());
    //res.type('application/vnd.openxmlformats-officedocument.wordprocessingml.document').send(file)
     return new StreamableFile(Readable.from(file).setEncoding('utf8'))
  }

  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename="myfile.docx"')
  @Get('file')
  async getFile()
  {
    return new StreamableFile(await this.appService.sendFile(), {disposition: "attachment; filename=\"myfile.docx\"", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
  }

}

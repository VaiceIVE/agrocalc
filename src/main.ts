import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin:[
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://178.170.192.87:3000",
      "http://178.170.192.87:3000/",
      "http://178.170.192.87:8888",
      "http://178.170.192.87:8888/"
    ]
  })
  useContainer(app.select(AppModule), { 
    fallbackOnErrors: true 
   });
  await app.listen(8000);
}
bootstrap();

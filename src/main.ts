import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin:[
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://178.170.192.87:3000",
      "http://178.170.192.87:3000/"
    ]
  })
  await app.listen(3000);
}
bootstrap();

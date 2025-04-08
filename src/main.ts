import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on: http://localhost:${port}`);
}
bootstrap();
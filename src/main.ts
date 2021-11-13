import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //
  // myapi.com/clarin/api/users
  // myapi.com/bayer/api/user
  app.setGlobalPrefix(':tenant?/api');
  await app.listen(AppModule.port);
}
bootstrap();

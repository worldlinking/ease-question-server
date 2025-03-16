import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TansformInterceptor } from './tansform/tansform.interceptor';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new TansformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();

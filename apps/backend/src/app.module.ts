import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './controllers/hello.controller';
import { HelloService } from './services/hello.service';

@Module({
  imports: [],
  controllers: [AppController, HelloController],
  providers: [AppService, HelloService],
})
export class AppModule {}

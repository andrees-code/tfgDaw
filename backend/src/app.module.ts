import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { OllamaModule } from './ollama/ollama/ollama.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.URI as string),
    UserModule,
    OllamaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

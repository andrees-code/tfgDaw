import { Module } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { OllamaController } from './ollama.controller';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [OllamaController],
  providers: [OllamaService],
})
export class OllamaModule {}

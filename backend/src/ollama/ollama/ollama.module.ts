import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OllamaService } from './ollama.service';
import { OllamaController } from './ollama.controller';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule, // aporta la JwtStrategy para el guard
  ],
  controllers: [OllamaController],
  providers: [OllamaService],
  exports: [OllamaService]
})
export class OllamaModule {}

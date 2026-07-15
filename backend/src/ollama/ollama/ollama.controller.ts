import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { JwtAuthGuard } from '../../user/jwt-auth.guard';

@Controller('api')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @UseGuards(JwtAuthGuard)
  @Post('chat')
  async chat(@Body('messages') messages: any[]) {
    return await this.ollamaService.chat(messages);
  }
}

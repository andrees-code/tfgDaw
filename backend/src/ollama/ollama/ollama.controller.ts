// ollama.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { OllamaService } from './ollama.service';

@Controller('api')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post('chat')
  async chat(@Body('messages') messages: any[]) {
    // llamamos al servicio, que ya devuelve JSON seguro
    const response = await this.ollamaService.chat(messages);
    return response;
  }
}

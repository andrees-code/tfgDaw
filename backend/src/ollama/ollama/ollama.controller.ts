import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { OllamaService } from './ollama.service';

@Controller('api')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  // 🔹 MODO NORMAL
  @Post('chat')
  async chat(@Body('messages') messages: any[]) {
    return await this.ollamaService.chat(messages);
  }

  // 🔹 MODO STREAMING (reactivo)
@Post('chat/stream')
async chatStream(
  @Body('messages') messages: any[],
  @Res() res: Response,
) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let closed = false;

  // 🔹 Si el cliente cierra la conexión
  res.on('close', () => {
    closed = true;
  });

  await this.ollamaService.streamChat(
    messages,

    // 🔹 onToken
    (token) => {
      if (!closed) {
        res.write(`data: ${token}\n\n`);
      }
    },

    // 🔹 onEnd (OBLIGATORIO)
    () => {
      if (!closed) {
        res.write('event: end\ndata: done\n\n');
        res.end();
        closed = true;
      }
    },
  );
}

}

// ollama.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OllamaService {
  private readonly OLLAMA_URL = 'http://localhost:11434/v1/chat/completions';

  async chat(messages: any[]) {
    try {
      const ollamaRes = await axios.post(this.OLLAMA_URL, {
        model: 'llama3:instruct',
        messages,
        stream: false,
      });

      const content = ollamaRes.data?.choices?.[0]?.message?.content || '';
      return { message: { content } };

    } catch (error) {
      console.error('Error llamando a Ollama:', error.message || error);
      // Siempre devolvemos JSON aunque falle
      return { message: { content: 'Error llamando a Ollama' } };
    }
  }
}

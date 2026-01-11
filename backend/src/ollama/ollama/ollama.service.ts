import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OllamaService {
  private readonly CHAT_URL = 'http://localhost:11434/v1/chat/completions';
  private readonly STREAM_URL = 'http://localhost:11434/api/chat';

  // 🔹 MODO NORMAL
  async chat(messages: any[]) {
    const res = await axios.post(this.CHAT_URL, {
      model: 'llama3:instruct',
      messages,
      stream: false,
    });

    const content = res.data?.choices?.[0]?.message?.content || '';
    return { message: { content } };
  }

  // 🔹 MODO STREAMING
  async streamChat(
  messages: any[],
  onToken: (token: string) => void,
  onEnd: () => void,
) {
  const res = await axios.post(
    'http://localhost:11434/api/chat',
    {
      model: 'llama3:instruct',
      messages,
      stream: true,
    },
    { responseType: 'stream' },
  );

  let buffer = '';

  res.data.on('data', (chunk) => {
    buffer += chunk.toString();

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const json = JSON.parse(line);

        if (json.message?.content) {
          onToken(json.message.content);
        }

        // 👈 Ollama indica fin así
        if (json.done === true) {
          onEnd();
        }
      } catch {
        // ignorar líneas incompletas
      }
    }
  });
}
}

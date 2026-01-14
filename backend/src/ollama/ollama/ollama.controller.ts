import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import { OllamaService } from './ollama.service';
import { UserService } from '../../user/user.service';
import { JwtAuthGuard } from '../../user/jwt-auth.guard';

const FREE_EXAMS_LIMIT = 5;

@Controller('api')
@UseGuards(JwtAuthGuard)
export class OllamaController {
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly userService: UserService,
  ) {}

  @Post('chat')
  async chat(
    @Body('messages') messages: any[],
    @Req() req: Request,
  ) {
    // 🔑 Usuario autenticado vía JWT
    const userId = req.user['id'];
    const user = await this.userService.getUser(userId);

    if (!user) {
      throw new ForbiddenException('Usuario no válido');
    }

    // -----------------------------
    // 🔒 LÍMITE SOLO PARA FREE
    // -----------------------------
    if (user.subscription?.plan === 'free') {
      const now = new Date();

      // Inicialización defensiva
      if (!user.aiUsage) {
        user.aiUsage = {
          examsThisMonth: 0,
          resetAt: now,
        };
      }

      const lastReset = new Date(user.aiUsage.resetAt);

      // Reset mensual automático
      const isNewMonth =
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear();

      if (isNewMonth) {
        user.aiUsage.examsThisMonth = 0;
        user.aiUsage.resetAt = now;
      }

      if (user.aiUsage.examsThisMonth >= FREE_EXAMS_LIMIT) {
        throw new ForbiddenException(
          'Has alcanzado el límite de 5 exámenes mensuales del plan gratuito',
        );
      }
    }

    // -----------------------------
    // 🤖 GENERAR EXAMEN COMPLETO
    // -----------------------------
    // Aquí puedes mantener tu lógica de bloques, prompts, etc.
    // El endpoint /chat ahora devuelve TODO el examen de una vez.
    const response = await this.ollamaService.chat(messages);

    // -----------------------------
    // ➕ INCREMENTAR USO SOLO UNA VEZ POR EXAMEN
    // -----------------------------
    if (user.subscription?.plan === 'free') {
      await this.userService.updateAiUsage(userId, {
        examsThisMonth: user.aiUsage.examsThisMonth + 1,
        resetAt: user.aiUsage.resetAt,
      });
    }

    return response;
  }
}

// src/subscriptions/subscriptions.controller.ts
import { Controller, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';

@Controller('api/v1/subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // 💳 Crear sesión Stripe Checkout
  @UseGuards(JwtAuthGuard)
  @Post('create-checkout-session')
  async createCheckoutSession(
    @Req() req,
    @Body('plan') plan: 'monthly' | 'yearly',
  ) {
    // Validar plan
    if (!['monthly', 'yearly'].includes(plan)) {
      throw new BadRequestException('Plan inválido');
    }

    // Llamar al service para crear la sesión de Stripe
    const session = await this.subscriptionsService.createCheckoutSession(
      req.user.id,
      plan,
    );

    // Devolver la URL de Stripe para redirigir en frontend
    return { url: session.url };
  }
}

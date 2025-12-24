import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './schemas/user.schema/user.schema';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule, // 👈 necesario para usar ConfigService
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        collection: 'usuarios',
      },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy, // 👈 obligatorio para AuthGuard('jwt')
  ],
  exports: [
    PassportModule, // 👈 para que otros módulos (Ollama) puedan usar AuthGuard
    JwtModule,
  ],
})
export class UserModule {}

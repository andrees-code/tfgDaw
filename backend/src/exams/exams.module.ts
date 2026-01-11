import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { Exam, ExamSchema } from './schemas/exam.schema';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { JwtStrategy } from '../user/jwt.strategy';
import { UserModule } from '../user/user.module'; // IMPORTANTE: traer UserModule para usar JwtStrategy

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule, // ⚠️ necesitamos la estrategia JWT
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}

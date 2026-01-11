import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Exam extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId

  @Prop()
  title: string

  @Prop()
  tipo: string

  @Prop()
  dificultad: string

  @Prop()
  numPreguntas: number

  @Prop({ type: String })
  apuntes: string

  @Prop({ type: String })
  preguntas: string

  @Prop({ type: String })
  respuestas: string

  @Prop({ default: false })
  favorito: boolean

  @Prop({ type: String, default: '' })
  asignatura: string


}

export const ExamSchema = SchemaFactory.createForClass(Exam)

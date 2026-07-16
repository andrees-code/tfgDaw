import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// Elemento decorativo/organizativo del calendario de la Zona de Estudio.
// kind = 'sticker' (emoji), 'text' (mini-nota de color) o 'event' (con hora).
@Schema({ timestamps: true })
export class CalendarItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId

  @Prop({ required: true, index: true })
  date: string // formato YYYY-MM-DD

  @Prop({ required: true, enum: ['sticker', 'text', 'event'] })
  kind: string

  @Prop({ type: String, default: null })
  emoji: string | null // solo stickers

  @Prop({ type: String, default: '' })
  text: string // texto de mini-nota o título de evento

  @Prop({ type: String, default: null })
  color: string | null

  @Prop({ type: String, default: null })
  time: string | null // formato HH:mm, solo eventos

  @Prop({ type: Number, default: 0 })
  order: number
}

export const CalendarItemSchema = SchemaFactory.createForClass(CalendarItem)

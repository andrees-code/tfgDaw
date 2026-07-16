import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Note extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId

  @Prop()
  title: string

  @Prop()
  type: string // Documento, Nota, Post-it

  @Prop({ type: String, default: '' })
  content: string

  @Prop({ default: 'bg-yellow-200' })
  color: string // solo para Post-its

  @Prop({ default: false })
  favorito: boolean

  // NUEVO CAMPO
  @Prop({ type: String, required: false, default: null })
  calendarDate: string | null

  // Carpeta contenedora (null = raíz)
  @Prop({ type: Types.ObjectId, ref: 'Folder', default: null })
  folderId: Types.ObjectId | null

  // Papelera: fecha de eliminación (null = activo). Se purga a los 30 días.
  @Prop({ type: Date, default: null, index: true })
  deletedAt: Date | null
}

export const NoteSchema = SchemaFactory.createForClass(Note)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

// Carpeta de la Zona de Estudio. El anidamiento (subcarpetas ilimitadas)
// se modela con parentId: null = carpeta raíz.
@Schema({ timestamps: true })
export class Folder extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId

  @Prop({ required: true, trim: true })
  name: string

  @Prop({ type: Types.ObjectId, ref: 'Folder', default: null })
  parentId: Types.ObjectId | null

  @Prop({ type: String, default: null })
  color: string | null

  @Prop({ type: Number, default: 0 })
  order: number
}

export const FolderSchema = SchemaFactory.createForClass(Folder)

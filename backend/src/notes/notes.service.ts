import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Note } from "./schemas/note.schema"
import { CreateNoteDto } from "./dto/create-note.dto"

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name)
    private noteModel: Model<Note>,
  ) {}

  create(userId: string, dto: CreateNoteDto) {
    return this.noteModel.create({ ...dto, userId })
  }

  findAllByUser(userId: string) {
    return this.noteModel
      .find({ userId, deletedAt: null })
      .sort({ updatedAt: -1 })
      .exec()
  }

  findOne(userId: string, noteId: string) {
    return this.noteModel
      .findOne({ _id: noteId, userId })
      .exec()
  }

  // Enviar a la papelera (soft delete)
  async delete(userId: string, noteId: string) {
    const res = await this.noteModel.updateOne(
      { _id: noteId, userId },
      { $set: { deletedAt: new Date() } },
    )
    return { trashed: res.modifiedCount > 0 }
  }

  // Papelera: primero purga lo que supere 30 días, luego devuelve lo vigente
  async findTrash(userId: string) {
    await this.purgeExpired(userId)
    return this.noteModel
      .find({ userId, deletedAt: { $ne: null } })
      .sort({ deletedAt: -1 })
      .exec()
  }

  async restore(userId: string, noteId: string) {
    const note = await this.noteModel.findOne({ _id: noteId, userId })
    if (!note) throw new NotFoundException('Nota no encontrada')
    note.deletedAt = null
    return note.save()
  }

  // Destrucción definitiva
  purge(userId: string, noteId: string) {
    return this.noteModel.deleteOne({ _id: noteId, userId, deletedAt: { $ne: null } })
  }

  purgeExpired(userId: string) {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    return this.noteModel.deleteMany({ userId, deletedAt: { $ne: null, $lt: cutoff } })
  }

  // Mover en bloque a la papelera (usado al borrar una carpeta). Se limpia la
  // carpeta para que al restaurar aparezca en Inicio (su carpeta ya no existe).
  trashByFolders(userId: string, folderIds: (string | Types.ObjectId)[]) {
    return this.noteModel.updateMany(
      { userId, folderId: { $in: folderIds } },
      { $set: { deletedAt: new Date(), folderId: null } },
    )
  }

  async toggleFavorite(id: string, userId: string) {
    const note = await this.noteModel.findOne({ _id: id, userId })
    if (!note) throw new NotFoundException()
    note.favorito = !note.favorito
    return note.save()
  }

  async updateTitle(id: string, userId: string, title: string) {
    const note = await this.noteModel.findOne({ _id: id, userId })
    if (!note) throw new NotFoundException('Nota no encontrada')
    note.title = title
    return note.save()
  }

  async updateContent(id: string, userId: string, content: string) {
    const note = await this.noteModel.findOne({ _id: id, userId })
    if (!note) throw new NotFoundException('Nota no encontrada')
    note.content = content
    return note.save()
  }

  async updateColor(id: string, userId: string, color: string) {
    const note = await this.noteModel.findOne({ _id: id, userId })
    if (!note) throw new NotFoundException('Nota no encontrada')
    note.color = color
    return note.save()
  }

  // NUEVO MÉTODO
  async updateDate(id: string, userId: string, date: string | null) {
    const note = await this.noteModel.findOne({ _id: id, userId })
    if (!note) throw new NotFoundException('Nota no encontrada')
    note.calendarDate = date
    return note.save()
  }

  // Mover nota a otra carpeta (null = raíz)
  async updateFolder(id: string, userId: string, folderId: string | null) {
    const note = await this.noteModel.findOne({ _id: id, userId })
    if (!note) throw new NotFoundException('Nota no encontrada')
    note.folderId = folderId ? new Types.ObjectId(folderId) : null
    return note.save()
  }
}
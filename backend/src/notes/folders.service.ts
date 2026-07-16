import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, Types } from "mongoose"
import { Folder } from "./schemas/folder.schema"
import { Note } from "./schemas/note.schema"
import { Exam } from "../exams/schemas/exam.schema"
import { CreateFolderDto, UpdateFolderDto } from "./dto/folder.dto"

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder.name)
    private folderModel: Model<Folder>,

    @InjectModel(Note.name)
    private noteModel: Model<Note>,

    @InjectModel(Exam.name)
    private examModel: Model<Exam>,
  ) {}

  async create(userId: string, dto: CreateFolderDto) {
    if (dto.parentId) {
      const parent = await this.folderModel.findOne({ _id: dto.parentId, userId })
      if (!parent) throw new NotFoundException('Carpeta padre no encontrada')
    }
    return this.folderModel.create({
      name: dto.name,
      parentId: dto.parentId || null,
      color: dto.color ?? null,
      order: dto.order ?? 0,
      userId,
    })
  }

  findAllByUser(userId: string) {
    return this.folderModel.find({ userId }).sort({ order: 1, createdAt: 1 }).exec()
  }

  async update(userId: string, folderId: string, dto: UpdateFolderDto) {
    const folder = await this.folderModel.findOne({ _id: folderId, userId })
    if (!folder) throw new NotFoundException('Carpeta no encontrada')

    if (dto.parentId !== undefined) {
      if (dto.parentId === folderId) {
        throw new BadRequestException('Una carpeta no puede ser su propio padre')
      }
      if (dto.parentId) {
        const parent = await this.folderModel.findOne({ _id: dto.parentId, userId })
        if (!parent) throw new NotFoundException('Carpeta destino no encontrada')
        // Evitar ciclos: el destino no puede ser descendiente de la carpeta movida
        if (await this.isDescendant(userId, folderId, dto.parentId)) {
          throw new BadRequestException('No puedes mover una carpeta dentro de sí misma')
        }
        folder.parentId = new Types.ObjectId(dto.parentId)
      } else {
        folder.parentId = null
      }
    }

    if (dto.name !== undefined) folder.name = dto.name
    if (dto.color !== undefined) folder.color = dto.color
    if (dto.order !== undefined) folder.order = dto.order

    return folder.save()
  }

  // ¿candidateId es descendiente de ancestorId?
  private async isDescendant(userId: string, ancestorId: string, candidateId: string): Promise<boolean> {
    let current = await this.folderModel.findOne({ _id: candidateId, userId }).lean()
    while (current?.parentId) {
      if (current.parentId.toString() === ancestorId) return true
      current = await this.folderModel.findOne({ _id: current.parentId, userId }).lean()
    }
    return false
  }

  // Borra la carpeta y TODO su contenido: las subcarpetas se eliminan de forma
  // recursiva y los documentos/exámenes que contienen pasan a la papelera.
  async delete(userId: string, folderId: string) {
    const folder = await this.folderModel.findOne({ _id: folderId, userId })
    if (!folder) throw new NotFoundException('Carpeta no encontrada')

    const ids = await this.collectSubtreeIds(userId, folderId)
    const now = new Date()

    // Documentos y exámenes del subárbol → papelera (se limpia folderId para
    // que al restaurar aparezcan en Inicio, ya que su carpeta deja de existir).
    await this.noteModel.updateMany(
      { userId, folderId: { $in: ids } },
      { $set: { deletedAt: now, folderId: null } },
    )
    await this.examModel.updateMany(
      { userId, folderId: { $in: ids } },
      { $set: { deletedAt: now, folderId: null } },
    )

    await this.folderModel.deleteMany({ userId, _id: { $in: ids } })
    return { deleted: true, folderIds: ids.map(String) }
  }

  // IDs de la carpeta y todas sus descendientes
  private async collectSubtreeIds(userId: string, rootId: string): Promise<Types.ObjectId[]> {
    const all = await this.folderModel.find({ userId }).select('_id parentId').lean()
    const childrenOf = new Map<string, Types.ObjectId[]>()
    for (const f of all) {
      const key = f.parentId ? f.parentId.toString() : 'root'
      if (!childrenOf.has(key)) childrenOf.set(key, [])
      childrenOf.get(key)!.push(f._id as Types.ObjectId)
    }
    const result: Types.ObjectId[] = []
    const stack = [new Types.ObjectId(rootId)]
    while (stack.length) {
      const id = stack.pop()!
      result.push(id)
      for (const child of childrenOf.get(id.toString()) || []) stack.push(child)
    }
    return result
  }
}

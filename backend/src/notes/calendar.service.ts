import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { CalendarItem } from "./schemas/calendar-item.schema"
import { CreateCalendarItemDto, UpdateCalendarItemDto } from "./dto/calendar-item.dto"

const MAX_STICKERS_PER_DAY = 4

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(CalendarItem.name)
    private calendarItemModel: Model<CalendarItem>,
  ) {}

  async create(userId: string, dto: CreateCalendarItemDto) {
    if (dto.kind === 'sticker') {
      const count = await this.calendarItemModel.countDocuments({ userId, date: dto.date, kind: 'sticker' })
      if (count >= MAX_STICKERS_PER_DAY) {
        throw new BadRequestException(`Máximo ${MAX_STICKERS_PER_DAY} stickers por día`)
      }
    }
    return this.calendarItemModel.create({ ...dto, userId })
  }

  findAllByUser(userId: string) {
    return this.calendarItemModel.find({ userId }).sort({ date: 1, order: 1 }).exec()
  }

  async update(userId: string, itemId: string, dto: UpdateCalendarItemDto) {
    const item = await this.calendarItemModel.findOne({ _id: itemId, userId })
    if (!item) throw new NotFoundException('Elemento de calendario no encontrado')
    Object.assign(item, dto)
    return item.save()
  }

  async delete(userId: string, itemId: string) {
    const res = await this.calendarItemModel.deleteOne({ _id: itemId, userId })
    if (res.deletedCount === 0) throw new NotFoundException('Elemento de calendario no encontrado')
    return { deleted: true }
  }
}

import { Controller, Post, Req, UseGuards, Body, Get, Delete, Param, Patch } from "@nestjs/common"
import { CalendarService } from "./calendar.service"
import { CreateCalendarItemDto, UpdateCalendarItemDto } from "./dto/calendar-item.dto"
import { JwtAuthGuard } from "../user/jwt-auth.guard"

@UseGuards(JwtAuthGuard)
@Controller('api/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateCalendarItemDto) {
    return this.calendarService.create(req.user.id, dto)
  }

  @Get()
  findAll(@Req() req) {
    return this.calendarService.findAllByUser(req.user.id)
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateCalendarItemDto) {
    return this.calendarService.update(req.user.id, id, dto)
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.calendarService.delete(req.user.id, id)
  }
}

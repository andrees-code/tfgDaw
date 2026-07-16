import { Controller, Post, Req, UseGuards, Body, Get, Delete, Param, Patch } from "@nestjs/common"
import { NotesService } from "./notes.service"
import { CreateNoteDto } from "./dto/create-note.dto"
import { JwtAuthGuard } from "../user/jwt-auth.guard"

@UseGuards(JwtAuthGuard)
@Controller('api/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.id, dto)
  }

  @Get()
  findAll(@Req() req) {
    return this.notesService.findAllByUser(req.user.id)
  }

  // Papelera (debe ir antes de :id para no colisionar con la ruta paramétrica)
  @Get('trash')
  findTrash(@Req() req) {
    return this.notesService.findTrash(req.user.id)
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.notesService.findOne(req.user.id, id)
  }

  // Enviar a la papelera (soft delete)
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.notesService.delete(req.user.id, id)
  }

  // Restaurar de la papelera
  @Post(':id/restore')
  restore(@Req() req, @Param('id') id: string) {
    return this.notesService.restore(req.user.id, id)
  }

  // Destrucción definitiva
  @Delete(':id/permanent')
  purge(@Req() req, @Param('id') id: string) {
    return this.notesService.purge(req.user.id, id)
  }

  @Patch(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Req() req) {
    return this.notesService.toggleFavorite(id, req.user.id)
  }

  @Patch(':id/title')
  updateTitle(@Param('id') id: string, @Req() req, @Body('title') title: string) {
    return this.notesService.updateTitle(id, req.user.id, title)
  }

  @Patch(':id/content')
  updateContent(@Param('id') id: string, @Req() req, @Body('content') content: string) {
    return this.notesService.updateContent(id, req.user.id, content)
  }

  @Patch(':id/color')
  updateColor(@Param('id') id: string, @Req() req, @Body('color') color: string) {
    return this.notesService.updateColor(id, req.user.id, color)
  }

  // NUEVO ENDPOINT
  @Patch(':id/date')
  updateDate(@Param('id') id: string, @Req() req, @Body('date') date: string) {
    return this.notesService.updateDate(id, req.user.id, date)
  }

  // Mover nota a otra carpeta (null = raíz)
  @Patch(':id/folder')
  updateFolder(@Param('id') id: string, @Req() req, @Body('folderId') folderId: string | null) {
    return this.notesService.updateFolder(id, req.user.id, folderId)
  }
}
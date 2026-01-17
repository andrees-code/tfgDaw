import { Controller, Post, Req, UseGuards, Body, Get, Delete, Param, Patch } from "@nestjs/common";
import { ExamsService } from "./exams.service";
import { CreateExamDto } from "./dto/create-exam.dto";
import { JwtAuthGuard } from "../user/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('api/exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  // ----------------------------
  // Crear examen en DB
  // ----------------------------
  @Post()
  create(@Req() req, @Body() dto: CreateExamDto) {
    console.log('🔥 create() llamado desde controller');
    console.log('REQ USER:', req.user);
    return this.examsService.create(req.user.id, dto);
  }

  // ----------------------------
  // GENERAR EXAMEN CON IA
  // ----------------------------
  @Post('generate')
  async generateExam(@Req() req, @Body() dto: { tipo: string; dificultad: string; numPreguntas: number; apuntes: string }) {
    console.log('🔥 generateExam() llamado desde controller');
    console.log('REQ USER:', req.user);

    return this.examsService.generateExamWithLimit(req.user.id, dto);
  }

  // ----------------------------
  // Endpoints originales
  // ----------------------------
  @Get()
  findAll(@Req() req) {
    return this.examsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.examsService.findOne(req.user.id, id);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.examsService.delete(req.user.id, id);
  }

  @Patch(':id/favorite')
  toggleFavorite(@Param('id') id: string, @Req() req) {
    return this.examsService.toggleFavorite(id, req.user.id);
  }

  @Get('favorites/me')
  getFavorites(@Req() req) {
    return this.examsService.getFavorites(req.user.id);
  }

  @Patch(':id/asignatura')
  updateAsignatura(@Param('id') id: string, @Req() req, @Body('asignatura') asignatura: string) {
    return this.examsService.updateAsignatura(id, req.user.id, asignatura);
  }

  @Patch(':id/title')
  updateTitle(@Param('id') id: string, @Req() req, @Body('title') title: string) {
    return this.examsService.updateTitle(id, req.user.id, title);
  }
}

import { Controller, Post, Req, UseGuards, Body, Get, Delete, Param, Patch } from "@nestjs/common"
import { FoldersService } from "./folders.service"
import { CreateFolderDto, UpdateFolderDto } from "./dto/folder.dto"
import { JwtAuthGuard } from "../user/jwt-auth.guard"

@UseGuards(JwtAuthGuard)
@Controller('api/folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateFolderDto) {
    return this.foldersService.create(req.user.id, dto)
  }

  @Get()
  findAll(@Req() req) {
    return this.foldersService.findAllByUser(req.user.id)
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateFolderDto) {
    return this.foldersService.update(req.user.id, id, dto)
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.foldersService.delete(req.user.id, id)
  }
}

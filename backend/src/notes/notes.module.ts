import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'

import { Note, NoteSchema } from './schemas/note.schema'
import { Folder, FolderSchema } from './schemas/folder.schema'
import { CalendarItem, CalendarItemSchema } from './schemas/calendar-item.schema'
import { Exam, ExamSchema } from '../exams/schemas/exam.schema'
import { NotesController } from './notes.controller'
import { NotesService } from './notes.service'
import { FoldersController } from './folders.controller'
import { FoldersService } from './folders.service'
import { CalendarController } from './calendar.controller'
import { CalendarService } from './calendar.service'
import { JwtStrategy } from '../user/jwt.strategy'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Note.name, schema: NoteSchema },
      { name: Folder.name, schema: FolderSchema },
      { name: CalendarItem.name, schema: CalendarItemSchema },
      { name: Exam.name, schema: ExamSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule
  ],
  controllers: [NotesController, FoldersController, CalendarController],
  providers: [NotesService, FoldersService, CalendarService]
})
export class NotesModule {}

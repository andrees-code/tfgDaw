import { IsInt, IsString, Min } from 'class-validator'

export class CreateExamDto {
  @IsString()
  title: string

  @IsString()
  tipo: string

  @IsString()
  dificultad: string

  @IsInt()
  @Min(1)
  numPreguntas: number

  @IsString()
  apuntes: string

  @IsString()
  preguntas: string

  @IsString()
  respuestas: string
}

import { IsInt, IsOptional, IsString, Min } from 'class-validator'

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

  @IsOptional()
  @IsString()
  apuntes?: string

  @IsString()
  preguntas: string

  @IsString()
  respuestas: string

  @IsOptional()
  @IsString()
  categoria?: string

  @IsOptional()
  @IsString()
  tema?: string

  @IsOptional()
  @IsString()
  modo?: string
}

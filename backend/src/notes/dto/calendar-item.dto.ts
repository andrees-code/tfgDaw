import { IsString, IsOptional, IsIn, IsNumber, Matches } from 'class-validator'

export class CreateCalendarItemDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date debe tener formato YYYY-MM-DD' })
  date: string

  @IsIn(['sticker', 'text', 'event'])
  kind: string

  @IsOptional()
  @IsString()
  emoji?: string

  @IsOptional()
  @IsString()
  text?: string

  @IsOptional()
  @IsString()
  color?: string

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/, { message: 'time debe tener formato HH:mm' })
  time?: string

  @IsOptional()
  @IsNumber()
  order?: number
}

export class UpdateCalendarItemDto {
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date debe tener formato YYYY-MM-DD' })
  date?: string

  @IsOptional()
  @IsString()
  emoji?: string

  @IsOptional()
  @IsString()
  text?: string

  @IsOptional()
  @IsString()
  color?: string

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/, { message: 'time debe tener formato HH:mm' })
  time?: string

  @IsOptional()
  @IsNumber()
  order?: number
}

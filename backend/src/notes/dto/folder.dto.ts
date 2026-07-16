import { IsString, IsOptional, IsNumber } from 'class-validator'

export class CreateFolderDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  parentId?: string | null

  @IsOptional()
  @IsString()
  color?: string

  @IsOptional()
  @IsNumber()
  order?: number
}

export class UpdateFolderDto {
  @IsOptional()
  @IsString()
  name?: string

  // null = mover a la raíz
  @IsOptional()
  parentId?: string | null

  @IsOptional()
  @IsString()
  color?: string

  @IsOptional()
  @IsNumber()
  order?: number
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserDto } from './dto/user.dto/user.dto';
import { CreateUserDto } from './dto/user.dto/CreateUserDto';
import { LoginUserDto } from './dto/user.dto/LoginUserDto';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ➕ Registro
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const { user, token } = await this.userService.register(createUserDto);
      return { status: true, user, token };
    } catch (e: any) {
      throw new BadRequestException({ status: false, message: e.message });
    }
  }

  // 🔑 Login
@Post('login')
async login(@Body() loginUserDto: LoginUserDto) {
  try {
    const { user, token } = await this.userService.login(loginUserDto); // solo 1 argumento
    return { status: true, user, token };
  } catch (e: any) {
    throw new BadRequestException({ status: false, message: e.message });
  }
}



  // ➕ Crear usuario (admin)
  @Post()
  async addUser(@Body() userDto: UserDto) {
    try {
      await this.userService.addUser(userDto);
      return { status: true, message: 'User successfully created' };
    } catch (e: any) {
      throw new BadRequestException({ status: false, message: e.message });
    }
  }

  // 📄 Obtener todos
  @Get()
  async getUsers() {
    try {
      const data = await this.userService.getUsers();
      return { status: true, data };
    } catch (e: any) {
      throw new BadRequestException({ status: false, message: e.message });
    }
  }

  // 🔍 Obtener por ID
  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    try {
      const data = await this.userService.getUser(id);
      return { status: true, data };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException({ status: false, message: e.message });
    }
  }

  // 🔍 Buscar por username
  @Get('byUsername')
  async getUserByUsername(@Query('username') username: string) {
    try {
      const data = await this.userService.getUserByUsername(username);
      return { status: true, data };
    } catch (e: any) {
      throw new InternalServerErrorException({ status: false, message: e.message });
    }
  }

  // 🔄 Update completo
  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    try {
      await this.userService.updateUser(id, userDto);
      return { status: true, message: 'User updated' };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException({ status: false, message: e.message });
    }
  }

  // 🩹 Patch parcial
  @Patch('update/:id')
  async patchUser(@Param('id') id: string, @Body() partialUserDto: Partial<UserDto>) {
    try {
      await this.userService.patchUser(id, partialUserDto);
      return { status: true, message: 'User partially updated' };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException({ status: false, message: e.message });
    }
  }

  // ❌ Eliminar usuario
  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.userService.deleteUser(id);
      return { status: true, message: 'User deleted' };
    } catch (e: any) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException({ status: false, message: e.message });
    }
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './interfaces/user/user.interface';
import { UserDocument } from './interfaces/user/user-document';
import { UserDto } from './dto/user.dto/user.dto';
import { CreateUserDto } from './dto/user.dto/CreateUserDto';
import { LoginUserDto } from './dto/user.dto/LoginUserDto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  // ➕ Crear usuario manual/admin
  async addUser(userDto: UserDto): Promise<User> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }
    const user = new this.userModel(userDto);
    const savedUser = await user.save();
    const { password, ...rest } = savedUser.toObject();
    return { ...rest, _id: savedUser._id.toString() } as User;
  }

  // 🔐 Registro
  async register(data: CreateUserDto) {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) throw new BadRequestException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.userModel.create({
      ...data,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: newUser._id.toString(), role: newUser.role });

    const { password, ...userWithoutPassword } = newUser.toObject();
    return { user: { ...userWithoutPassword, _id: newUser._id.toString() }, token };
  }

  // 🔑 Login
  async login(data: LoginUserDto) {
    const user = await this.userModel.findOne({ email: data.email }).select('+password');
    if (!user) throw new BadRequestException('Usuario o contraseña incorrecta');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new BadRequestException('Usuario o contraseña incorrecta');

    const token = this.jwtService.sign({ id: user._id.toString(), role: user.role });

    const { password, ...userWithoutPassword } = user.toObject();
    return { user: { ...userWithoutPassword, _id: user._id.toString() }, token };
  }

  // 📄 Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(u => {
      const { password, ...rest } = u.toObject();
      return { ...rest, _id: u._id.toString() } as User;
    });
  }

  // 🔍 Obtener por ID
  async getUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    const { password, ...rest } = user.toObject();
    return { ...rest, _id: user._id.toString() } as User;
  }

  // 🔍 Buscar por username
  async getUserByUsername(username: string): Promise<User[]> {
    const regex = new RegExp(username, 'i');
    const users = await this.userModel.find({ username: { $regex: regex } }).exec();
    return users.map(u => {
      const { password, ...rest } = u.toObject();
      return { ...rest, _id: u._id.toString() } as User;
    });
  }

  // 🔄 Update completo con hash de password si existe
  async updateUser(id: string, userDto: UserDto): Promise<User> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: userDto }, { new: true })
      .exec();

    if (!updatedUser) throw new NotFoundException('User not found');

    const { password, ...rest } = updatedUser.toObject();
    return { ...rest, _id: updatedUser._id.toString() } as User;
  }

  // 🩹 Patch parcial
  async patchUser(id: string, partialUserDto: Partial<UserDto>): Promise<User> {
    if (partialUserDto.password) {
      partialUserDto.password = await bcrypt.hash(partialUserDto.password, 10);
    }

    const patchedUser = await this.userModel
      .findByIdAndUpdate(id, { $set: partialUserDto }, { new: true })
      .exec();

    if (!patchedUser) throw new NotFoundException('User not found');

    const { password, ...rest } = patchedUser.toObject();
    return { ...rest, _id: patchedUser._id.toString() } as User;
  }

  // ❌ Eliminar
  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException('User not found');
    const { password, ...rest } = deletedUser.toObject();
    return { ...rest, _id: deletedUser._id.toString() } as User;
  }

  async updateAiUsage(
  userId: string,
  aiUsage: {
    examsThisMonth: number;
    resetAt: Date;
  },
): Promise<void> {
  const result = await this.userModel.updateOne(
    { _id: userId },
    {
      $set: { aiUsage },
    },
  );

  if (result.matchedCount === 0) {
    throw new NotFoundException('User not found');
  }
}

}

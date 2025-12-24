import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from './interfaces/user/user.interface';
import { UserDocument } from './interfaces/user/user-document';
import { UserDto } from './dto/user.dto/user.dto';
import { CreateUserDto } from './dto/user.dto/CreateUserDto';
import { LoginUserDto } from './dto/user.dto/LoginUserDto';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  // ➕ Crear usuario (admin/manual)
  async addUser(userDto: UserDto): Promise<User> {
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }
    const user = new this.userModel(userDto);
    const savedUser = await user.save();
    const { password, ...rest } = savedUser.toObject();
    return { ...rest, _id: savedUser._id.toString() };
  }

  // 🔐 Registro
  async register(data: CreateUserDto): Promise<{ user: User; token: string }> {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) throw new BadRequestException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.userModel.create({
      ...data,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id.toString(), role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });

    const { password, ...userWithoutPassword } = newUser.toObject();
    return { user: { ...userWithoutPassword, _id: newUser._id.toString() }, token };
  }

  // 🔑 Login
  async login(loginData: LoginUserDto): Promise<{ user: User; token: string }> {
    const user = await this.userModel
      .findOne({ email: loginData.email })
      .select('+password')
      .exec();

    if (!user) throw new BadRequestException('Usuario o contraseña incorrecta');

    const isValid = await bcrypt.compare(loginData.password, user.password);
    if (!isValid) throw new BadRequestException('Usuario o contraseña incorrecta');

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    const { password, ...userWithoutPassword } = user.toObject();
    return { user: { ...userWithoutPassword, _id: user._id.toString() }, token };
  }

  // 📄 Obtener todos
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(u => {
      const { password, ...rest } = u.toObject();
      return { ...rest, _id: u._id.toString() };
    });
  }

  // 🔍 Obtener por ID
  async getUser(idUser: string): Promise<User> {
    const user = await this.userModel.findById(idUser).exec();
    if (!user) throw new NotFoundException('User not found');
    const { password, ...rest } = user.toObject();
    return { ...rest, _id: user._id.toString() };
  }

  // 🔍 Buscar por username
  async getUserByUsername(username: string): Promise<User[]> {
    const regex = new RegExp(username, 'i');
    const users = await this.userModel.find({ username: { $regex: regex } }).exec();
    return users.map(u => {
      const { password, ...rest } = u.toObject();
      return { ...rest, _id: u._id.toString() };
    });
  }

  // 🔄 Update completo
  async updateUser(id: string, userDto: UserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: userDto },
      { new: true },
    ).exec();

    if (!updatedUser) throw new NotFoundException('User not found');
    const { password, ...rest } = updatedUser.toObject();
    return { ...rest, _id: updatedUser._id.toString() };
  }

  // 🩹 Patch parcial
  async patchUser(id: string, partialUserDto: Partial<UserDto>): Promise<User> {
    const patchedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: partialUserDto },
      { new: true },
    ).exec();

    if (!patchedUser) throw new NotFoundException('User not found');
    const { password, ...rest } = patchedUser.toObject();
    return { ...rest, _id: patchedUser._id.toString() };
  }

  // ❌ Eliminar
  async deleteUser(idUser: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(idUser).exec();
    if (!deletedUser) throw new NotFoundException('User not found');
    const { password, ...rest } = deletedUser.toObject();
    return { ...rest, _id: deletedUser._id.toString() };
  }
}

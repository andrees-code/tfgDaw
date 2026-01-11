import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Exam } from "./schemas/exam.schema"
import { CreateExamDto } from "./dto/create-exam.dto"

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name)
    private examModel: Model<Exam>,
  ) {}

  create(userId: string, dto: CreateExamDto) {
    return this.examModel.create({
      ...dto,
      userId
    })
  }

  findAllByUser(userId: string) {
    return this.examModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec()
  }

  findOne(userId: string, examId: string) {
    return this.examModel
      .findOne({ _id: examId, userId })
      .exec()
  }

  delete(userId: string, examId: string) {
    return this.examModel.deleteOne({
      _id: examId,
      userId
    })
  }

  async toggleFavorite(id: string, userId: string) {
  const exam = await this.examModel.findOne({
    _id: id,
    userId,
  })

  if (!exam) throw new NotFoundException()

  exam.favorito = !exam.favorito
  return exam.save()
}

async getFavorites(userId: string) {
  return this.examModel.find({
    userId,
    favorito: true,
  })
}

async updateAsignatura(
  examId: string,
  userId: string,
  asignatura: string
) {
  const exam = await this.examModel.findOne({
    _id: examId,
    userId
  })

  if (!exam) {
    throw new NotFoundException('Examen no encontrado')
  }

  exam.asignatura = asignatura
  return exam.save()
}

async updateTitle(examId: string, userId: string, title: string) {
  const exam = await this.examModel.findOne({ _id: examId, userId });
  if (!exam) {
    throw new NotFoundException('Examen no encontrado');
  }
  exam.title = title;
  return exam.save();
}



}

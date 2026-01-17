import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Exam } from "./schemas/exam.schema";
import { CreateExamDto } from "./dto/create-exam.dto";
import { UserDocument } from "../user/schemas/user.schema/user.schema";
import { OllamaService } from "../ollama/ollama/ollama.service";

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name)
    private examModel: Model<Exam>,

    @InjectModel('User')
    private userModel: Model<UserDocument>,

    private ollamaService: OllamaService, // 🔹 inyectamos OllamaService
  ) {}

  // ----------------------------
  // CREAR EXAMEN EN DB (tu función original)
  // ----------------------------
  async create(userId: string, dto: CreateExamDto) {
    console.log('🔥 create() llamado con userId:', userId);

    const userObjectId = new Types.ObjectId(userId);

    // 1️⃣ Buscar usuario
    const user = await this.userModel.findById(userObjectId).lean();
    if (!user) throw new ForbiddenException('Usuario no válido');

    // 2️⃣ Limitar solo usuarios free
    if (user.subscription?.plan === 'free') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const examsThisMonth = await this.examModel.countDocuments({
        userId: userObjectId,
        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      });

      console.log('Exámenes este mes:', examsThisMonth);

      if (examsThisMonth >= 5) {
        throw new ForbiddenException(
          'Has alcanzado el límite de 5 exámenes este mes. Actualiza tu plan.'
        );
      }
    }

    // 3️⃣ Crear examen
    return this.examModel.create({
      ...dto,
      userId: userObjectId,
    });
  }

  // ----------------------------
  // GENERAR EXAMEN CON IA Y LÍMITE PARA FREE
  // ----------------------------
  async generateExamWithLimit(userId: string, dto: {
    tipo: string,
    dificultad: string,
    numPreguntas: number,
    apuntes: string
  }) {
    const userObjectId = new Types.ObjectId(userId);

    // 1️⃣ Buscar usuario
    const user = await this.userModel.findById(userObjectId).lean();
    if (!user) throw new ForbiddenException('Usuario no válido');

    // 2️⃣ Limitar si es FREE
    if (user.subscription?.plan === 'free') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const examsThisMonth = await this.examModel.countDocuments({
        userId: userObjectId,
        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      });

      console.log('Exámenes generados este mes:', examsThisMonth);

      if (examsThisMonth >= 5) {
        throw new ForbiddenException('Has alcanzado el límite de 5 exámenes este mes para plan FREE.');
      }
    }

    // 3️⃣ Generación de bloques
    const bloques: number[] = [];
    let restantes = dto.numPreguntas;
    while (restantes > 0) {
      bloques.push(Math.min(5, restantes));
      restantes -= 5;
    }

    let resultado = '';
    let respuestasInternas = '';
    let contadorPreguntas = 1;

    for (let bloqueSize of bloques) {
      // Generar preguntas
      const promptPreg = this.buildPromptPreguntas(bloqueSize, contadorPreguntas, resultado, dto);
      const respPreg = await this.ollamaService.chat([
        { role: 'system', content: 'Eres una máquina estricta de generación de exámenes. No añadas texto de relleno.' },
        { role: 'user', content: promptPreg }
      ]);
      let preguntasBloque = respPreg.message?.content?.trim() || '';
      preguntasBloque = preguntasBloque.replace(/```/g, '').trim();
      resultado += preguntasBloque + "\n\n";

      // Generar respuestas
      const promptResp = this.buildPromptRespuestas(preguntasBloque, dto);
      const resp = await this.ollamaService.chat([
        { role: 'system', content: 'Eres un profesor corrigiendo un examen. Sé directo.' },
        { role: 'user', content: promptResp }
      ]);
      let respuestasBloque = resp.message?.content?.trim() || '';
      respuestasBloque = respuestasBloque.replace(/```/g, '').trim();
      respuestasInternas += respuestasBloque + "\n";

      contadorPreguntas += bloqueSize;
    }

    return {
      preguntas: resultado.trim(),
      respuestas: respuestasInternas.trim()
    };
  }

  // ----------------------------
  // FUNCIONES AUXILIARES PARA PROMPTS
  // ----------------------------
  private buildPromptPreguntas(cantidad: number, inicio: number, preguntasPrevias: string, dto: any) {
    const tipo = dto.tipo;
    const ap = dto.apuntes.substring(0, 15000);
    const instruccionBase = `
ROL: Eres un generador de exámenes académico estricto.
TAREA: Generar preguntas de examen basadas en el texto proporcionado.
REGLA DE ORO: NO converses. SOLO entrega el contenido del examen.
`;

    const contextoNegativo = preguntasPrevias.length > 10
      ? `HISTORIAL: Ya generaste estas preguntas anteriormente:
"""
${preguntasPrevias}
"""
NO repitas preguntas ni temas exactos.`
      : '';

    if (tipo === "Test (4 opciones)") {
      return `${instruccionBase}${contextoNegativo}
Genera EXACTAMENTE ${cantidad} preguntas de opción múltiple.
La primera pregunta DEBE ser la número ${inicio}.
Formato:
${inicio}. Enunciado
a) Opción
b) Opción
c) Opción
d) Opción

TEXTO BASE:
"""${ap}"""`;
    }

    if (tipo === "Verdadero/Falso") {
      return `${instruccionBase}${contextoNegativo}
Genera EXACTAMENTE ${cantidad} afirmaciones.
La primera afirmación DEBE ser la número ${inicio}.
Formato:
${inicio}. [Afirmación]

TEXTO BASE:
"""${ap}"""`;
    }

    if (tipo === "Respuestas cortas" || tipo === "Respuestas largas") {
      return `${instruccionBase}${contextoNegativo}
Genera EXACTAMENTE ${cantidad} preguntas abiertas.
La primera pregunta DEBE ser la número ${inicio}.

TEXTO BASE:
"""${ap}"""`;
    }

    return `${instruccionBase}${contextoNegativo}
Genera ${cantidad} preguntas variadas (Test, V/F, Abiertas) empezando por el número ${inicio}.
TEXTO BASE: """${ap}"""`;
  }

  private buildPromptRespuestas(preguntas: string, dto: any) {
    const tipo = dto.tipo;
    const ap = dto.apuntes.substring(0, 15000);
    const instruccionBase = `Eres un motor de corrección automatizado.
TU OBJETIVO: Proveer la clave de respuestas correcta basada en el texto.
FORMATO DE SALIDA: Lista numerada simple.`;

    if (tipo === "Test (4 opciones)") {
      return `${instruccionBase}
INSTRUCCIONES:
- Devuelve solo el número y la letra.
PREGUNTAS A RESOLVER:
"""${preguntas}"""
REFERENCIA: """${ap}"""`;
    }

    if (tipo === "Verdadero/Falso") {
      return `${instruccionBase}
INSTRUCCIONES:
- Devuelve número y "Verdadero" o "Falso".
PREGUNTAS A RESOLVER:
"""${preguntas}"""
REFERENCIA: """${ap}"""`;
    }

    return `${instruccionBase}
- Responde de forma concisa y académica.
PREGUNTAS A RESOLVER:
"""${preguntas}"""
REFERENCIA: """${ap}"""`;
  }

  // ----------------------------
  // RESTO DE FUNCIONES ORIGINALES
  // ----------------------------
  findAllByUser(userId: string) {
    return this.examModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  findOne(userId: string, examId: string) {
    return this.examModel
      .findOne({ _id: examId, userId: new Types.ObjectId(userId) })
      .exec();
  }

  delete(userId: string, examId: string) {
    return this.examModel.deleteOne({
      _id: examId,
      userId: new Types.ObjectId(userId),
    });
  }

  async toggleFavorite(id: string, userId: string) {
    const exam = await this.examModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });

    if (!exam) throw new NotFoundException();

    exam.favorito = !exam.favorito;
    return exam.save();
  }

  async getFavorites(userId: string) {
    return this.examModel.find({
      userId: new Types.ObjectId(userId),
      favorito: true,
    });
  }

  async updateAsignatura(examId: string, userId: string, asignatura: string) {
    const exam = await this.examModel.findOne({
      _id: examId,
      userId: new Types.ObjectId(userId),
    });

    if (!exam) throw new NotFoundException('Examen no encontrado');

    exam.asignatura = asignatura;
    return exam.save();
  }

  async updateTitle(examId: string, userId: string, title: string) {
    const exam = await this.examModel.findOne({
      _id: examId,
      userId: new Types.ObjectId(userId),
    });

    if (!exam) throw new NotFoundException('Examen no encontrado');

    exam.title = title;
    return exam.save();
  }
}

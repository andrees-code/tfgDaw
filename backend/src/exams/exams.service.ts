import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Exam } from "./schemas/exam.schema";
import { CreateExamDto } from "./dto/create-exam.dto";
import { UserDocument } from "../user/schemas/user.schema/user.schema";
import { OllamaService } from "../ollama/ollama/ollama.service";
import { Folder } from "../notes/schemas/folder.schema";

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name)
    private examModel: Model<Exam>,

    @InjectModel('User')
    private userModel: Model<UserDocument>,

    @InjectModel(Folder.name)
    private folderModel: Model<Folder>,

    private ollamaService: OllamaService,
  ) {}

  // ----------------------------
  // CREAR EXAMEN EN DB (Sin cambios)
  // ----------------------------
  async create(userId: string, dto: CreateExamDto) {
    const userObjectId = new Types.ObjectId(userId);
    const user = await this.userModel.findById(userObjectId).lean();
    if (!user) throw new ForbiddenException('Usuario no válido');

    if (user.subscription?.plan === 'free') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const examsThisMonth = await this.examModel.countDocuments({
        userId: userObjectId,
        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      });

      if (examsThisMonth >= 5) {
        throw new ForbiddenException(
          'Has alcanzado el límite de 5 exámenes este mes. Actualiza tu plan.'
        );
      }
    }

    return this.examModel.create({
      ...dto,
      userId: userObjectId,
    });
  }

  // ----------------------------
  // GENERAR EXAMEN CON IA (Lógica principal igual, prompts cambiados abajo)
  // ----------------------------
  async generateExamWithLimit(userId: string, dto: {
    tipo: string,
    dificultad: string,
    numPreguntas: number,
    apuntes?: string,
    categoria?: string,
    tema?: string,
    modo?: string,
  }) {
    if (!dto.apuntes?.trim() && !dto.tema?.trim()) {
      throw new BadRequestException('Debes indicar unos apuntes o un tema para generar el examen.');
    }

    const userObjectId = new Types.ObjectId(userId);

    // Validación usuario (igual que antes)
    const user = await this.userModel.findById(userObjectId).lean();
    if (!user) throw new ForbiddenException('Usuario no válido');

    if (user.subscription?.plan === 'free') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      const examsThisMonth = await this.examModel.countDocuments({
        userId: userObjectId,
        createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      });

      if (examsThisMonth >= 5) {
        throw new ForbiddenException('Has alcanzado el límite de 5 exámenes este mes para plan FREE.');
      }
    }

    // Generación de bloques (igual que antes)
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
      // 1. Generar preguntas
      const promptPreg = this.buildPromptPreguntas(bloqueSize, contadorPreguntas, resultado, dto);
      const respPreg = await this.ollamaService.chat([
        { role: 'system', content: 'Eres un profesor experto creando exámenes académicos de alta precisión.' },
        { role: 'user', content: promptPreg }
      ]);
      
      let preguntasBloque = respPreg.message?.content?.trim() || '';
      preguntasBloque = preguntasBloque.replace(/```/g, '').trim(); // Limpieza básica
      resultado += preguntasBloque + "\n\n";

      // 2. Generar respuestas
      const promptResp = this.buildPromptRespuestas(preguntasBloque, dto);
      const resp = await this.ollamaService.chat([
        { role: 'system', content: 'Eres un corrector académico experto. Tu prioridad es la veracidad fáctica.' },
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
  // FUNCIONES AUXILIARES PARA PROMPTS (MODIFICADAS)
  // ----------------------------

  // Instrucciones adicionales según la categoría del examen, para acercar el
  // estilo de las preguntas al de cada tipo de prueba oficial.
  private static readonly CONTEXTO_CATEGORIA: Record<string, string> = {
    carnet_conducir:
      'CONTEXTO: Genera preguntas al estilo del examen teórico oficial de la DGT española (permiso B), basándote en el Reglamento General de Circulación y la normativa de tráfico vigente.',
    programacion:
      'CONTEXTO: Genera preguntas técnicas de programación rigurosas, evaluando corrección conceptual, sintaxis y buenas prácticas.',
    oposiciones_policia:
      'CONTEXTO: Genera preguntas al estilo de exámenes oficiales de oposición a Policía Nacional/Local en España, basándote en la legislación vigente (Constitución Española, organización del Estado, derecho penal básico, etc.).',
  };

  private getContextoCategoria(categoria?: string): string {
    if (!categoria) return '';
    return ExamsService.CONTEXTO_CATEGORIA[categoria] || '';
  }

  // Construye el bloque de "fuente" del prompt: apuntes pegados por el
  // usuario, o si no hay, el tema elegido (predefinido o libre).
  private buildFuenteBlock(dto: any): { etiqueta: string; contenido: string } {
    if (dto.apuntes?.trim()) {
      return { etiqueta: 'TEXTO GUÍA (APUNTES)', contenido: dto.apuntes.substring(0, 15000) };
    }
    return { etiqueta: 'TEMA A EVALUAR', contenido: dto.tema?.trim() || '' };
  }

  private buildPromptPreguntas(cantidad: number, inicio: number, preguntasPrevias: string, dto: any) {
    const tipo = dto.tipo;
    const dificultad = dto.dificultad || 'media';
    const fuente = this.buildFuenteBlock(dto);
    const ap = fuente.contenido;
    const usaTema = !dto.apuntes?.trim();

    // INSTRUCCIÓN CLAVE: Usar apuntes como contexto, conocimiento propio para la precisión.
    const instruccionBase = `
ROL: Eres un profesor universitario experto diseñando exámenes.
${this.getContextoCategoria(dto.categoria)}
FUENTE DE TEMAS: ${usaTema
      ? 'Usa el tema indicado abajo como área a evaluar. No tienes apuntes del alumno: apóyate en tu propio conocimiento estándar y actualizado sobre ese tema y esa categoría de examen.'
      : 'Usa el siguiente texto SOLO para identificar los temas, conceptos y contexto clave que el alumno debe estudiar.'}
CALIDAD: Usa TU PROPIO conocimiento académico general para formular las preguntas. Asegúrate de que sean rigurosas, precisas y no ambiguas.
DIFICULTAD: ${dificultad}.
REGLA: No inventes información falsa${usaTema ? '' : ', pero si los apuntes son vagos, complétalos con definiciones académicas estándar correctas'}.
`;

    const contextoNegativo = preguntasPrevias.length > 10
      ? `HISTORIAL: Ya has creado estas preguntas (evita repetirlas): """${preguntasPrevias}"""`
      : '';

    // --- TIPO TEST (4 opciones) ---
    if (tipo === "Test (4 opciones)") {
      return `${instruccionBase}
${contextoNegativo}

TAREA: Genera ${cantidad} preguntas de selección múltiple (Test).
FORMATO OBLIGATORIO:
${inicio}. [Enunciado claro y académico]
a) [Opción correcta o distractor plausible]
b) [Opción correcta o distractor plausible]
c) [Opción correcta o distractor plausible]
d) [Opción correcta o distractor plausible]

REQUISITOS:
1. Solo una opción debe ser indiscutiblemente correcta.
2. Evita preguntas con respuestas "Todas las anteriores" o "Ninguna de las anteriores".
3. Las definiciones deben ser precisas (ej: diferencia bien área de perímetro).
4. La numeración empieza en ${inicio}.

${fuente.etiqueta}:
"""${ap}"""`;
    }

    // --- TIPO VERDADERO/FALSO ---
    if (tipo === "Verdadero/Falso") {
      return `${instruccionBase}
${contextoNegativo}

TAREA: Genera ${cantidad} afirmaciones para responder con Verdadero o Falso.
FORMATO OBLIGATORIO:
${inicio}. [Afirmación completa]

REQUISITOS:
1. Las afirmaciones deben ser objetivamente verdaderas o falsas, sin ambigüedades.
2. Evita opiniones subjetivas.
3. La numeración empieza en ${inicio}.

${fuente.etiqueta}:
"""${ap}"""`;
    }

    // --- TIPO RESPUESTAS CORTAS ---
    if (tipo === "Respuestas cortas") {
      return `${instruccionBase}
${contextoNegativo}

TAREA: Genera ${cantidad} preguntas abiertas de respuesta breve.
FORMATO OBLIGATORIO:
${inicio}. [Pregunta directa y concisa]

REQUISITOS:
1. La pregunta debe poder responderse en 1 o 2 frases.
2. Enfócate en definiciones, fechas clave, nombres o conceptos específicos del texto.
3. La numeración empieza en ${inicio}.

${fuente.etiqueta}:
"""${ap}"""`;
    }

    // --- TIPO RESPUESTAS LARGAS ---
    if (tipo === "Respuestas largas") {
      return `${instruccionBase}
${contextoNegativo}

TAREA: Genera ${cantidad} preguntas de desarrollo.
FORMATO OBLIGATORIO:
${inicio}. [Pregunta compleja o de desarrollo]

REQUISITOS:
1. Pide explicaciones, relaciones entre conceptos, causas y consecuencias.
2. La numeración empieza en ${inicio}.

${fuente.etiqueta}:
"""${ap}"""`;
    }

    // --- TIPO MIX ---
    return `${instruccionBase}
${contextoNegativo}

TAREA: Genera ${cantidad} preguntas variadas sobre los temas del texto.
Mezcla aleatoriamente estos formatos:
- Opción múltiple (a,b,c,d)
- Verdadero/Falso
- Preguntas abiertas

REQUISITOS:
1. Asegura precisión académica máxima.
2. La numeración empieza en ${inicio}.

${fuente.etiqueta}:
"""${ap}"""`;
  }


  private buildPromptRespuestas(preguntas: string, dto: any) {
    const tipo = dto.tipo;
    const ap = this.buildFuenteBlock(dto).contenido;

    // INSTRUCCIÓN CLAVE: Priorizar la verdad factual sobre el texto proporcionado si hay conflicto.
    const instruccionBase = `
ROL: Eres un corrector oficial de exámenes.
${this.getContextoCategoria(dto.categoria)}
OBJETIVO: Generar la hoja de respuestas correcta.
IMPORTANTE: Basa tus respuestas en la VERDAD ACADÉMICA ESTÁNDAR. Usa el texto/tema proporcionado como contexto para entender a qué se refieren las preguntas, pero si es ambiguo, prioriza la definición universalmente correcta.
`;

    // --- RESPUESTAS TEST ---
    if (tipo === "Test (4 opciones)") {
      return `${instruccionBase}

INSTRUCCIONES:
- Analiza cada pregunta y determina cuál es la opción correcta.
- Devuelve SOLO el número y la letra correcta.
- Formato: "1. a", "2. c", etc.

PREGUNTAS A RESOLVER:
"""${preguntas}"""

CONTEXTO DEL TEMA:
"""${ap}"""`;
    }

    // --- RESPUESTAS V/F ---
    if (tipo === "Verdadero/Falso") {
      return `${instruccionBase}

INSTRUCCIONES:
- Analiza la veracidad de cada afirmación.
- Devuelve SOLO el número y la palabra "Verdadero" o "Falso".
- Formato: "1. Verdadero", "2. Falso".

PREGUNTAS A RESOLVER:
"""${preguntas}"""

CONTEXTO DEL TEMA:
"""${ap}"""`;
    }

    // --- RESPUESTAS ABIERTAS Y MIX ---
    return `${instruccionBase}

INSTRUCCIONES:
- Proporciona la respuesta correcta o la pauta de corrección ideal.
- Sé conciso pero preciso.
- Formato lista numerada.

PREGUNTAS A RESOLVER:
"""${preguntas}"""

CONTEXTO DEL TEMA:
"""${ap}"""`;
  }

  // ----------------------------
  // RESTO DE FUNCIONES (Find, Delete, etc.) - Sin cambios
  // ----------------------------
  findAllByUser(userId: string) {
    return this.examModel.find({ userId: new Types.ObjectId(userId), deletedAt: null }).sort({ createdAt: -1 }).exec();
  }

  findOne(userId: string, examId: string) {
    return this.examModel.findOne({ _id: examId, userId: new Types.ObjectId(userId) }).exec();
  }

  // Enviar a la papelera (soft delete)
  async delete(userId: string, examId: string) {
    const res = await this.examModel.updateOne(
      { _id: examId, userId: new Types.ObjectId(userId) },
      { $set: { deletedAt: new Date() } },
    );
    return { trashed: res.modifiedCount > 0 };
  }

  // Papelera de exámenes: purga lo caducado (>30 días) y devuelve lo vigente
  async findTrash(userId: string) {
    await this.purgeExpired(userId);
    return this.examModel
      .find({ userId: new Types.ObjectId(userId), deletedAt: { $ne: null } })
      .sort({ deletedAt: -1 })
      .exec();
  }

  async restore(userId: string, examId: string) {
    const exam = await this.examModel.findOne({ _id: examId, userId: new Types.ObjectId(userId) });
    if (!exam) throw new NotFoundException('Examen no encontrado');
    exam.deletedAt = null;
    return exam.save();
  }

  purge(userId: string, examId: string) {
    return this.examModel.deleteOne({ _id: examId, userId: new Types.ObjectId(userId), deletedAt: { $ne: null } });
  }

  purgeExpired(userId: string) {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return this.examModel.deleteMany({ userId: new Types.ObjectId(userId), deletedAt: { $ne: null, $lt: cutoff } });
  }

  // Mover en bloque a la papelera al borrar carpetas (limpia folderId)
  trashByFolders(userId: string, folderIds: (string | Types.ObjectId)[]) {
    return this.examModel.updateMany(
      { userId: new Types.ObjectId(userId), folderId: { $in: folderIds } },
      { $set: { deletedAt: new Date(), folderId: null } },
    );
  }

  async toggleFavorite(id: string, userId: string) {
    const exam = await this.examModel.findOne({ _id: id, userId: new Types.ObjectId(userId) });
    if (!exam) throw new NotFoundException();
    exam.favorito = !exam.favorito;
    return exam.save();
  }

  async getFavorites(userId: string) {
    return this.examModel.find({ userId: new Types.ObjectId(userId), favorito: true, deletedAt: null });
  }

  async updateAsignatura(examId: string, userId: string, asignatura: string) {
    const exam = await this.examModel.findOne({ _id: examId, userId: new Types.ObjectId(userId) });
    if (!exam) throw new NotFoundException('Examen no encontrado');
    exam.asignatura = asignatura;
    return exam.save();
  }

  async updateTitle(examId: string, userId: string, title: string) {
    const exam = await this.examModel.findOne({ _id: examId, userId: new Types.ObjectId(userId) });
    if (!exam) throw new NotFoundException('Examen no encontrado');
    exam.title = title;
    return exam.save();
  }

  // Fecha del calendario (null = desvincular del día)
  async updateDate(examId: string, userId: string, date: string | null) {
    const exam = await this.examModel.findOne({ _id: examId, userId: new Types.ObjectId(userId) });
    if (!exam) throw new NotFoundException('Examen no encontrado');
    exam.calendarDate = date;
    return exam.save();
  }

  // Mover examen a otra carpeta (null = raíz)
  async updateFolder(examId: string, userId: string, folderId: string | null) {
    const exam = await this.examModel.findOne({ _id: examId, userId: new Types.ObjectId(userId) });
    if (!exam) throw new NotFoundException('Examen no encontrado');
    exam.folderId = folderId ? new Types.ObjectId(folderId) : null;
    return exam.save();
  }

  // Migración única e idempotente: cada valor distinto de `asignatura` (legacy)
  // pasa a ser una carpeta raíz real. Solo toca exámenes sin folderId asignado aún.
  async migrateAsignaturas(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const pending = await this.examModel.find({
      userId: userObjectId,
      folderId: null,
      asignatura: { $nin: [null, ''] },
    });

    if (pending.length) {
      const names = [...new Set(pending.map(e => e.asignatura))];
      const folderByName = new Map<string, Types.ObjectId>();

      for (const name of names) {
        let folder = await this.folderModel.findOne({ userId: userObjectId, parentId: null, name });
        if (!folder) {
          folder = await this.folderModel.create({ userId: userObjectId, parentId: null, name });
        }
        folderByName.set(name, folder._id as Types.ObjectId);
      }

      for (const exam of pending) {
        exam.folderId = folderByName.get(exam.asignatura) ?? null;
        await exam.save();
      }
    }

    return this.examModel.find({ userId: userObjectId }).sort({ createdAt: -1 }).exec();
  }
}
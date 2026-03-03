import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.exam.findMany({
      include: {
        subDivision: true,
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            choices: {
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async create(dto: CreateExamDto) {
    const { questions, ...examData } = dto;

    return this.prisma.exam.create({
      data: {
        ...examData,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
        questions: questions
          ? {
              create: questions.map((q) => ({
                type: q.type,
                prompt: q.prompt,
                correctTextAnswer: q.correctTextAnswer,
                points: q.points,
                orderIndex: q.orderIndex,
                choices: q.choices
                  ? {
                      create: q.choices.map((c) => ({
                        label: c.label,
                        isCorrect: c.isCorrect,
                        orderIndex: c.orderIndex,
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateExamDto) {
    await this.findOne(id);
    const { questions, ...examData } = dto;

    // Simplified update: we update exam details. 
    // For questions, we might want separate APIs for granular control (add/update/remove question)
    // or clear and recreate them if provided in this bulk update.
    // For now, let's just update the exam fields.

    return this.prisma.exam.update({
      where: { id },
      data: {
        ...examData,
        startAt: dto.startAt ? new Date(dto.startAt) : undefined,
        endAt: dto.endAt ? new Date(dto.endAt) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.exam.delete({
      where: { id },
    });
  }

  // Question Management
  async addQuestion(examId: string, dto: any) {
    await this.findOne(examId);
    return this.prisma.question.create({
      data: {
        ...dto,
        examId,
        choices: dto.choices
          ? {
              create: dto.choices.map((c: any) => ({
                label: c.label,
                isCorrect: c.isCorrect,
                orderIndex: c.orderIndex,
              })),
            }
          : undefined,
      },
      include: { choices: true },
    });
  }

  async deleteQuestion(id: string) {
    return this.prisma.question.delete({
      where: { id },
    });
  }
}

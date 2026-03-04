import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { SubmitExamDto } from './dto/user-exam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Academy: Exam (User)')
@Controller('exams/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamUserController {
  constructor(private readonly examService: ExamService) {}

  @Get('available')
  @ApiOperation({ summary: 'Get available exams for user subdivision' })
  findAvailable(@GetUser('id') userId: string) {
    return this.examService.findAvailableExams(userId);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start an exam attempt' })
  startAttempt(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.examService.startAttempt(id, userId);
  }

  @Post('attempts/:attemptId/submit')
  @ApiOperation({ summary: 'Submit an exam attempt' })
  submitAttempt(
    @Param('attemptId') attemptId: string,
    @GetUser('id') userId: string,
    @Body() dto: SubmitExamDto,
  ) {
    return this.examService.submitAttempt(attemptId, userId, dto);
  }
}

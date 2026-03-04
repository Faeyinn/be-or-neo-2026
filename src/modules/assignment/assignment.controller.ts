import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { ScoreSubmissionDto } from './dto/score-submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserRole } from '../../../prisma/generated-client/client';

@ApiTags('Academy: Assignments')
@Controller('assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  // --- Assignment Management ---

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: Create new assignment' })
  create(@Body() dto: CreateAssignmentDto, @GetUser('id') adminId: string) {
    return this.assignmentService.create(dto, adminId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all assignments (Admin) or by subdivision (User)',
  })
  findAll(@GetUser('id') userId: string, @GetUser('role') role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.assignmentService.findAll();
    }
    return this.assignmentService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateAssignmentDto) {
    return this.assignmentService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }

  // --- Submissions ---

  @Post(':id/submit')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'User: Submit assignment' })
  @UseInterceptors(FileInterceptor('file'))
  submit(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.assignmentService.submit(id, userId, file);
  }

  @Get(':id/submissions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: Get all submissions for an assignment' })
  getSubmissions(@Param('id') id: string) {
    return this.assignmentService.getSubmissions(id);
  }

  @Patch('submissions/:submissionId/score')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Admin: Score a submission' })
  scoreSubmission(
    @Param('submissionId') submissionId: string,
    @Body() dto: ScoreSubmissionDto,
  ) {
    return this.assignmentService.scoreSubmission(submissionId, dto);
  }
}

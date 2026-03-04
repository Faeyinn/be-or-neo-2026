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
import { LearningModuleService } from './learning-module.service';
import { CreateLearningModuleDto } from './dto/create-learning-module.dto';
import { UpdateLearningModuleDto } from './dto/update-learning-module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { UserRole } from '../../../prisma/generated-client/client';

@ApiTags('Academy: Learning Modules')
@Controller('learning-modules')
@ApiBearerAuth()
export class LearningModuleController {
  constructor(private readonly learningModuleService: LearningModuleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Admin: Create new learning module' })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() dto: CreateLearningModuleDto,
    @GetUser('id') adminId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.learningModuleService.create(dto, adminId, file);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all modules (Admin) or by subdivision (User)' })
  findAll(@GetUser('id') userId: string, @GetUser('role') role: UserRole) {
    if (role === UserRole.ADMIN) {
      return this.learningModuleService.findAll();
    }
    return this.learningModuleService.findByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.learningModuleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLearningModuleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.learningModuleService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.learningModuleService.remove(id);
  }
}

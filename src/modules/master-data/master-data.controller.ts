import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MasterDataService } from './master-data.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreateDivisionDto,
  UpdateDivisionDto,
  CreateSubDivisionDto,
  UpdateSubDivisionDto,
} from './dto/master-data.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../../prisma/generated-client/client';

@ApiTags('Admin: Master Data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  // --- Department ---
  @Post('departments')
  @ApiOperation({ summary: 'Admin: Create new department' })
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.masterDataService.createDepartment(dto);
  }

  @Patch('departments/:id')
  @ApiOperation({ summary: 'Admin: Update department' })
  updateDepartment(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.masterDataService.updateDepartment(id, dto);
  }

  @Delete('departments/:id')
  @ApiOperation({ summary: 'Admin: Delete department' })
  deleteDepartment(@Param('id') id: string) {
    return this.masterDataService.deleteDepartment(id);
  }

  // --- Division ---
  @Post('divisions')
  @ApiOperation({ summary: 'Admin: Create new division' })
  createDivision(@Body() dto: CreateDivisionDto) {
    return this.masterDataService.createDivision(dto);
  }

  @Patch('divisions/:id')
  @ApiOperation({ summary: 'Admin: Update division' })
  updateDivision(@Param('id') id: string, @Body() dto: UpdateDivisionDto) {
    return this.masterDataService.updateDivision(id, dto);
  }

  @Delete('divisions/:id')
  @ApiOperation({ summary: 'Admin: Delete division' })
  deleteDivision(@Param('id') id: string) {
    return this.masterDataService.deleteDivision(id);
  }

  // --- SubDivision ---
  @Post('sub-divisions')
  @ApiOperation({ summary: 'Admin: Create new sub-division' })
  createSubDivision(@Body() dto: CreateSubDivisionDto) {
    return this.masterDataService.createSubDivision(dto);
  }

  @Patch('sub-divisions/:id')
  @ApiOperation({ summary: 'Admin: Update sub-division' })
  updateSubDivision(
    @Param('id') id: string,
    @Body() dto: UpdateSubDivisionDto,
  ) {
    return this.masterDataService.updateSubDivision(id, dto);
  }

  @Delete('sub-divisions/:id')
  @ApiOperation({ summary: 'Admin: Delete sub-division' })
  deleteSubDivision(@Param('id') id: string) {
    return this.masterDataService.deleteSubDivision(id);
  }
}

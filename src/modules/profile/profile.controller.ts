import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

class AvatarUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  avatar: any;
}

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user profile.' })
  @ApiResponse({ status: 404, description: 'Profile not found.' })
  async getMyProfile(@GetUser('id') userId: string) {
    return this.profileService.getProfile(userId);
  }

  @Get('departments')
  @ApiOperation({ summary: 'Get all departments' })
  async getDepartments() {
    return this.profileService.getDepartments();
  }

  @Get('divisions/:departmentId')
  @ApiOperation({ summary: 'Get divisions by department ID' })
  async getDivisions(@Param('departmentId') departmentId: string) {
    return this.profileService.getDivisions(departmentId);
  }

  @Get('sub-divisions/:divisionId')
  @ApiOperation({ summary: 'Get sub-divisions by division ID' })
  async getSubDivisions(@Param('divisionId') divisionId: string) {
    return this.profileService.getSubDivisions(divisionId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated.' })
  async updateMyProfile(
    @GetUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, dto);
  }

  @Post('me/avatar')
  @ApiOperation({ summary: 'Update profile avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Avatar successfully uploaded.' })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @GetUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() _dto: AvatarUploadDto,
  ) {
    return this.profileService.updateAvatar(userId, file);
  }
}

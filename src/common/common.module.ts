import { Module, Global } from '@nestjs/common';
import { CloudinaryStorageService } from './services/storage/cloudinary-storage.service';
import { PrismaService } from './services/prisma.service';

@Global()
@Module({
  providers: [
    {
      provide: 'IStorageService',
      useClass: CloudinaryStorageService,
    },
    PrismaService,
  ],
  exports: ['IStorageService', PrismaService],
})
export class CommonModule {}

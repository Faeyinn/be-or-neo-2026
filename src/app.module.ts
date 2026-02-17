import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { VerificationModule } from './modules/verification/verification.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TimelineModule } from './modules/timeline/timeline.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    ProfileModule,
    VerificationModule,
    DashboardModule,
    TimelineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

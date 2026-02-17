import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../../common/services/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: PrismaService;

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(),
    },
    submissionVerification: {
      findFirst: jest.fn(),
    },
    payment: {
      findFirst: jest.fn(),
    },
    recruitmentTimeline: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return dashboard data for a user', async () => {
    const userId = 'user-1';
    
    mockPrismaService.profile.findUnique.mockResolvedValue({
      userId,
      fullName: 'John Doe',
      nim: '123',
      whatsappNumber: '0812',
      studyProgram: 'IT',
      departmentId: 'd1',
      divisionId: 'div1',
      subDivisionId: 'sub1',
      subDivision: { name: 'Web' },
    });
    mockPrismaService.submissionVerification.findFirst.mockResolvedValue({ status: 'APPROVED' });
    mockPrismaService.payment.findFirst.mockResolvedValue({ status: 'PAID' });
    mockPrismaService.recruitmentTimeline.findMany.mockResolvedValue([]);

    const result = await service.getMyDashboard(userId);

    expect(result).toBeDefined();
    expect(result.user.fullName).toBe('John Doe');
    expect(result.progress.currentStep).toBe(4); // Since everything is complete
    expect(result.steps[0].isCompleted).toBe(true);
    expect(result.steps[1].isCompleted).toBe(true);
    expect(result.steps[2].isCompleted).toBe(true);
  });

  it('should show step 1 if profile is incomplete', async () => {
    const userId = 'user-2';
    mockPrismaService.profile.findUnique.mockResolvedValue({ userId, fullName: 'Incomplete' });
    mockPrismaService.submissionVerification.findFirst.mockResolvedValue(null);
    mockPrismaService.payment.findFirst.mockResolvedValue(null);
    mockPrismaService.recruitmentTimeline.findMany.mockResolvedValue([]);

    const result = await service.getMyDashboard(userId);
    expect(result.progress.currentStep).toBe(1);
    expect(result.steps[0].isCompleted).toBe(false);
  });
});

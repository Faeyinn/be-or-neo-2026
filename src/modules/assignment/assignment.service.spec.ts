import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentService } from './assignment.service';
import { PrismaService } from '../../common/services/prisma.service';
import { CloudinaryStorageService } from '../../common/services/storage/cloudinary-storage.service';
import { ForbiddenException } from '@nestjs/common';
import { AttemptStatus } from '../../../prisma/generated-client/client';

describe('AssignmentService', () => {
  let service: AssignmentService;
  let prisma: PrismaService;
  let storage: CloudinaryStorageService;

  const mockPrismaService = {
    assignment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    profile: { findUnique: jest.fn() },
    examAttempt: { findFirst: jest.fn() },
    assignmentSubmission: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockStorage = {
    uploadFile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CloudinaryStorageService,
          useValue: mockStorage,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
    prisma = module.get<PrismaService>(PrismaService);
    storage = module.get<CloudinaryStorageService>(CloudinaryStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an assignment', async () => {
      const dto = {
        title: 'JS Task',
        dueAt: new Date().toISOString(),
        subDivisionId: 'sub-1',
      };
      mockPrismaService.assignment.create.mockResolvedValue({
        id: 'asg-1',
        ...dto,
      });

      const result = await service.create(dto, 'admin-1');
      expect(result.id).toBe('asg-1');
      expect(prisma.assignment.create).toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    const userId = 'user-1';
    const asgId = 'asg-1';
    const file = { originalname: 'task.zip' } as any;

    it('should throw Forbidden if exam not submitted', async () => {
      mockPrismaService.examAttempt.findFirst.mockResolvedValue(null);
      await expect(service.submit(asgId, userId, file)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should create submission if none exists', async () => {
      mockPrismaService.examAttempt.findFirst.mockResolvedValue({
        status: AttemptStatus.SUBMITTED,
      });
      mockPrismaService.assignment.findUnique.mockResolvedValue({ id: asgId });
      mockPrismaService.assignmentSubmission.findFirst.mockResolvedValue(null);
      mockStorage.uploadFile.mockResolvedValue('url-zip');
      mockPrismaService.assignmentSubmission.create.mockResolvedValue({
        id: 'subm-1',
      });

      const result = await service.submit(asgId, userId, file);
      expect(result.id).toBe('subm-1');
      expect(prisma.assignmentSubmission.create).toHaveBeenCalled();
    });

    it('should update existing submission', async () => {
      mockPrismaService.examAttempt.findFirst.mockResolvedValue({
        status: AttemptStatus.SUBMITTED,
      });
      mockPrismaService.assignment.findUnique.mockResolvedValue({ id: asgId });
      mockPrismaService.assignmentSubmission.findFirst.mockResolvedValue({
        id: 'subm-1',
      });
      mockStorage.uploadFile.mockResolvedValue('new-url');
      mockPrismaService.assignmentSubmission.update.mockResolvedValue({
        id: 'subm-1',
      });

      await service.submit(asgId, userId, file);
      expect(prisma.assignmentSubmission.update).toHaveBeenCalled();
    });
  });

  describe('scoreSubmission', () => {
    it('should update score and feedback', async () => {
      mockPrismaService.assignmentSubmission.findUnique.mockResolvedValue({
        id: 'subm-1',
      });
      mockPrismaService.assignmentSubmission.update.mockResolvedValue({
        id: 'subm-1',
        score: 90,
      });

      const result = await service.scoreSubmission('subm-1', {
        score: 90,
        feedback: 'Good',
      });
      expect(result.score).toBe(90);
    });
  });
});

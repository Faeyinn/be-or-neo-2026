import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/services/prisma.service';

describe('Verification Admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userToken: string;
  let adminToken: string;
  let userId: string;
  let adminId: string;
  let submissionId: string;

  const userEmail = `user-v-${Date.now()}@example.com`;
  const adminEmail = `admin-v-${Date.now()}@example.com`;
  const password = 'Password123!';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('IStorageService')
      .useValue({ uploadFile: jest.fn().mockResolvedValue('http://mock.url') })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Create User
    await request(app.getHttpServer()).post('/api/auth/register').send({
      email: userEmail,
      password,
      fullName: 'Verification User',
      nim: `NIM-V-${Date.now()}`,
    });
    const userLogin = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: userEmail,
      password,
    });
    userToken = userLogin.body.access_token;
    userId = userLogin.body.user.id;

    // Create Admin
    await request(app.getHttpServer()).post('/api/auth/register').send({
      email: adminEmail,
      password,
      fullName: 'Admin Verifier',
      nim: `NIM-A-${Date.now()}`,
    });
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' },
    });
    const adminLogin = await request(app.getHttpServer()).post('/api/auth/login').send({
      email: adminEmail,
      password,
    });
    adminToken = adminLogin.body.access_token;
    adminId = adminLogin.body.user.id;

    // User submits verification
    const submission = await request(app.getHttpServer())
      .post('/api/verification/submit')
      .set('Authorization', `Bearer ${userToken}`)
      .field('twibbonLink', 'https://instagr.am/p/test')
      .expect(201);
    submissionId = submission.body.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [userEmail, adminEmail] } },
    });
    await app.close();
  });

  describe('Verification Admin Access Control', () => {
    it('/api/verification/admin/list (GET) - Forbidden for regular user', async () => {
      await request(app.getHttpServer())
        .get('/api/verification/admin/list')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('/api/verification/admin/review/:id (PATCH) - Forbidden for regular user', async () => {
      await request(app.getHttpServer())
        .patch(`/api/verification/admin/review/${submissionId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'APPROVED' })
        .expect(403);
    });
  });

  describe('Verification Admin Functionality', () => {
    it('/api/verification/admin/list (GET) - Should return list for admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/verification/admin/list')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const mySubmission = response.body.find((s: any) => s.id === submissionId);
      expect(mySubmission).toBeDefined();
      expect(mySubmission.status).toBe('PENDING');
    });

    it('/api/verification/admin/review/:id (PATCH) - Should approve submission', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/verification/admin/review/${submissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'APPROVED' })
        .expect(200);

      expect(response.body.status).toBe('APPROVED');
      expect(response.body.reviewedByAdminId).toBe(adminId);
    });

    it('/api/verification/me (GET) - User should see approved status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/verification/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.status).toBe('APPROVED');
    });

    it('/api/verification/admin/review/:id (PATCH) - Should reject submission', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/verification/admin/review/${submissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ 
          status: 'REJECTED',
          rejectionReason: 'Document not clear'
        })
        .expect(200);

      expect(response.body.status).toBe('REJECTED');
      expect(response.body.rejectionReason).toBe('Document not clear');
    });
  });
});

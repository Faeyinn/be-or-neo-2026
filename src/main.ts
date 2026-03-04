import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Open Recruitment Neo Telemetri 2026 API')
    .setDescription(
      'The complete API documentation for Open Recruitment Neo Telemetri 2026. ' +
        'This API handles user authentication, profile management, recruitment timelines, ' +
        'exam management, assignments, and more.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name must match @ApiBearerAuth('JWT-auth')
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Profile', 'User profile management')
    .addTag('Dashboard', 'Recruitment dashboard information')
    .addTag('Timeline', 'Recruitment process timelines')
    .addTag('Master Data', 'Departments, Divisions, and Sub-divisions management')
    .addTag('Learning Module', 'Educational materials and resources')
    .addTag('Exam', 'Online examination management')
    .addTag('Assignment', 'Task submissions and management')
    .addTag('Payment', 'Registration fee and payment verification')
    .addTag('Verification', 'Admin verification for various submissions')
    .addTag('Attendance', 'Event attendance tracking')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
    customSiteTitle: 'OR Neo Telemetri 2026 API Docs',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`\nServer is running on http://localhost:${port}/api`);
  console.log(`Swagger documentation: http://localhost:${port}/docs\n`);
}
void bootstrap();

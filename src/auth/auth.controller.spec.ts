import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/login (POST) - success', async () => {
    const loginResponse = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbmUiLCJzdWIiOjQsImlhdCI6MTcxNjIwMTAyMCwiZXhwIjoxNzE2MjA0NjIwfQ.OY5g4lvPiNjaCncfYnxlybrH1cZRs2gNnguC7pekCSc',
    };
    authService.validateUser.mockResolvedValue(true);
    authService.login.mockResolvedValue(loginResponse);

    const response = await request(app.getHttpServer())
      .post('/api/login')
      .send({ username: 'jane', password: 'changeme' })
      .expect(200);

    expect(response.body).toEqual(loginResponse);
  });

  it('/api/login (POST) - failure', async () => {
    authService.validateUser.mockResolvedValue(false);

    await request(app.getHttpServer())
      .post('/api/login')
      .send({ username: 'jane', password: 'wrongpassword' })
      .expect(401);
  });

  it('/api/register (POST) - success', async () => {
    const registerResponse = {
      id: 1,
      username: 'jane',
      password: 'hashedpassword',
    };
    authService.register.mockResolvedValue(registerResponse);

    const response = await request(app.getHttpServer())
      .post('/api/register')
      .send({ username: 'jane', password: 'changeme' })
      .expect(201);

    expect(response.body).toEqual(registerResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});

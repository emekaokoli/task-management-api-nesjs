import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';

const mockAuthService = {
  validateUser: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
  login: jest.fn().mockResolvedValue({ accessToken: 'test-token' }),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockReturnValue({ id: 1, username: 'testuser' }),
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'testpass' })
      .expect(200)
      .expect({
        accessToken: 'test-token',
      });
  });

  it('/auth/login (POST) - failure', () => {
    mockAuthService.validateUser.mockResolvedValueOnce(null);
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' })
      .expect(401);
  });
});

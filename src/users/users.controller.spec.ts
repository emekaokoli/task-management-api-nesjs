import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { RegisterDto } from '../auth/dto/register.dto';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { UserController } from './users.controller';
import { UserService } from './users.service';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue({
              id: 1,
              username: 'testuser',
              password: 'hashedpassword',
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe(),
      new ZodValidationPipe(RegisterDto),
    );
    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/users/register', () => {
    it('should create a new user', async () => {
      const registerDto = {
        username: 'testuser',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send(registerDto)
        .expect(201);

      expect(response.body).toEqual({
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
      });
      expect(userService.createUser).toHaveBeenCalledWith(
        registerDto.username,
        registerDto.password,
      );
    });

    it('should return a validation error if data is invalid', async () => {
      const invalidDto = {
        username: 'us',
        password: 'pw',
      };

      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send(invalidDto)
        .expect(400);

      expect(response.body).toEqual({
        error: 'Bad Request',
        message: [
          {
            code: 'too_small',
            exact: false,
            inclusive: true,
            message: 'Password must be at least 6 characters long',
            minimum: 6,
            path: ['password'],
            type: 'string',
          },
        ],
        statusCode: 400,
      });
    });
  });
});

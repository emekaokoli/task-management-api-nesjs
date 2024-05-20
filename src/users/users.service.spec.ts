import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import * as request from 'supertest';
import { RegisterDtoType } from '../auth/dto/register.dto'; // Adjust import path
import { UserController } from './users.controller';
import { UserService } from './users.service';

// Mock the Pool instance
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
  };
  return {
    Pool: jest.fn(() => mockPool),
  };
});

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;
  let mockPool: jest.Mocked<Pool>;

  beforeAll(async () => {
    mockPool = new Pool() as jest.Mocked<Pool>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: 'DATABASE_POOL',
          useValue: mockPool,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/users/register', () => {
    it('should create a new user', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
      };
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] }) as never;

      const createUserDto: RegisterDtoType = {
        username: 'testuser',
        password: 'password123',
      };

      const expectedQuery = `
      INSERT INTO users (username, password) 
      VALUES ($1, $2) 
      RETURNING *
    `; // Adjusted expected query with line breaks

      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toEqual(mockUser);
      expect(mockPool.query).toHaveBeenCalledWith(expectedQuery, [
        'testuser',
        'password123',
      ]);
    });
  });

  describe('GET /api/users/:username', () => {
    it('should find a user by username', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
      };
      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] }) as never;

      const response = await request(app.getHttpServer())
        .get('/api/users/testuser')
        .expect(200);

      expect(response.body).toEqual(mockUser);
      expect(mockPool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE username = $1',
        ['testuser'],
      );
    });
  });
});

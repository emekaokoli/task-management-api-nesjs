import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pool } from 'pg';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { User } from '../src/types';

jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
  };
  return {
    Pool: jest.fn(() => mockPool),
  };
});

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mockPool: jest.Mocked<Pool>;
  let authToken: string;
  let taskId: number;

  beforeAll(async () => {
    mockPool = new Pool() as jest.Mocked<Pool>;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('DATABASE_POOL')
      .useValue(mockPool)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Registration and Login', () => {
    it('should register a new user', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockUser] } as any);

      const registerUserDto = {
        username: 'testuser',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/api/users/register')
        .send(registerUserDto)
        .expect(201);

      expect(response.body).toEqual(mockUser);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
        ['testuser', 'password123'],
      );
    });

    it('should log in the user and return a JWT token', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockToken = { accessToken: 'mock-jwt-token' };

      mockPool.query.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            username: 'testuser',
            password: 'hashedpassword',
          },
        ],
      } as any);

      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginDto)
        .expect(200);

      authToken = response.body.accessToken;
      expect(authToken).toBeDefined();
    });
  });

  describe('Task Management', () => {
    it('should create a new task', async () => {
      const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        completed: false,
      };

      mockPool.query.mockResolvedValueOnce({ rows: [mockTask] } as any);

      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toEqual(mockTask);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO tasks (title, description, userId) VALUES ($1, $2, $3) RETURNING *',
        ['Test Task', 'Test Description', 1],
      );

      taskId = mockTask.id;
    });

    it('should update the task', async () => {
      const updatedTask = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };

      mockPool.query.mockResolvedValueOnce({ rows: [updatedTask] } as any);

      const updateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateTaskDto)
        .expect(200);

      expect(response.body).toEqual(updatedTask);
      expect(mockPool.query).toHaveBeenCalledWith(
        'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
        ['Updated Task', 'Updated Description', true, taskId],
      );
    });

    it('should delete the task', async () => {
      mockPool.query.mockResolvedValueOnce({ rows: [] } as any);

      await request(app.getHttpServer())
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      expect(mockPool.query).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1',
        [taskId],
      );
    });
  });
});

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pool, QueryResult } from 'pg';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { tasks } from 'src/db/queries';
import { Task } from 'src/types';
import * as request from 'supertest';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';

// Mock the Pool instance
jest.mock('pg', () => {
  const mockPool = {
    query: jest.fn(),
  };
  return {
    Pool: jest.fn(() => mockPool),
  };
});

// Mock the JwtAuthGuard
jest.mock('src/auth/jwt.guard');

describe('TaskController', () => {
  let app: INestApplication;
  let taskService: TaskService;
  let mockPool: jest.Mocked<Pool>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: Pool,
          useValue: new Pool(),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    taskService = moduleFixture.get<TaskService>(TaskService);
    mockPool = moduleFixture.get<Pool, jest.Mocked<Pool>>(Pool);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        completed: false,
        user_id: 1,
      };
      const mockQueryResult: QueryResult<Task> = {
        rows: [mockTask],
      } as QueryResult<Task>;
      mockPool.query.mockResolvedValueOnce(mockQueryResult) as never;

      const response = await request(app.getHttpServer())
        .post('/api/tasks')
        .send({ title: 'Task 1', description: 'Description 1' })
        .expect(201);

      expect(response.body).toEqual(mockTask);
      expect(mockPool.query).toHaveBeenCalledWith(tasks.insert, [
        'Task 1',
        'Description 1',
        false,
        1,
      ]);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return tasks for a given user ID', async () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          user_id: 1,
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Description 2',
          completed: true,
          user_id: 1,
        },
      ];
      const mockQueryResult: QueryResult<Task> = {
        rows: mockTasks,
      } as QueryResult<Task>;
      mockPool.query.mockResolvedValueOnce(mockQueryResult) as never;

      const response = await request(app.getHttpServer())
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toEqual(mockTasks);
      expect(mockPool.query).toHaveBeenCalledWith(tasks.selectById, [1]);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const updatedTask: Task = {
        id: 1,
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
        user_id: 1,
      };
      const mockQueryResult: QueryResult<Task> = {
        rows: [updatedTask],
      } as QueryResult<Task>;
      mockPool.query.mockResolvedValueOnce(mockQueryResult);

      const response = await request(app.getHttpServer())
        .put('/api/tasks/1')
        .send({
          title: 'Updated Task',
          description: 'Updated Description',
          completed: true,
        })
        .expect(200);

      expect(response.body).toEqual(updatedTask);
      expect(mockPool.query).toHaveBeenCalledWith(tasks.update, [
        'Updated Task',
        'Updated Description',
        true,
        1,
      ]);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      await request(app.getHttpServer()).delete('/api/tasks/1').expect(200);

      expect(mockPool.query).toHaveBeenCalledWith(tasks.delete, [1]);
    });
  });
});

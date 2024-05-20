import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { TasksService } from './tasks.service';

const mockTasksService = {
  findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test task' }),
  createTask: jest.fn().mockResolvedValue({ id: 1, title: 'Test task' }),
};

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks/:id (GET) - success', () => {
    return request(app.getHttpServer()).get('/tasks/1').expect(200).expect({
      id: 1,
      title: 'Test task',
    });
  });

  it('/tasks (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'New task', description: 'Test task description' })
      .expect(201)
      .expect({
        id: 1,
        title: 'Test task',
        description: 'Test task description',
      });
  });
});

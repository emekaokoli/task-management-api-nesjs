import { Pool, QueryResult } from 'pg';
import { tasks } from 'src/db/queries';
import { Task } from 'src/types';
import { TaskGatewayMock } from './task.gateway.mock';
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

describe('TaskService', () => {
  let service: TaskService;
  let taskGateway: TaskGatewayMock;
  let mockPool: jest.Mocked<Pool>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPool = new Pool() as jest.Mocked<Pool>;
    taskGateway = new TaskGatewayMock();
    service = new TaskService(mockPool, taskGateway);
  });

  describe('createTask', () => {
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
      mockPool.query.mockResolvedValueOnce(mockQueryResult);

      const createdTask = await service.createTask(
        'Task 1',
        'Description 1',
        1,
      );

      expect(mockPool.query).toHaveBeenCalledWith(tasks.insert, [
        'Task 1',
        'Description 1',
        false,
        1,
      ]);
      expect(createdTask).toEqual(mockTask);
    });
  });

  describe('getTasks', () => {
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
      mockPool.query.mockResolvedValueOnce(mockQueryResult);

      const userId = 1;
      const retrievedTasks = await service.getTasks(userId);

      expect(mockPool.query).toHaveBeenCalledWith(tasks.selectById, [userId]);
      expect(retrievedTasks).toEqual(mockTasks);
    });
  });

  describe('updateTask', () => {
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

      const taskId = 1;
      const updatedTaskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        completed: true,
      };
      const updatedTaskResult = await service.updateTask(
        taskId,
        updatedTaskData.title,
        updatedTaskData.description,
        updatedTaskData.completed,
      );

      expect(mockPool.query).toHaveBeenCalledWith(tasks.update, [
        'Updated Task',
        'Updated Description',
        true,
        1,
      ]);
      expect(updatedTaskResult).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      const taskId = 1;
      await service.deleteTask(taskId);

      expect(mockPool.query).toHaveBeenCalledWith(tasks.delete, [taskId]);
    });
  });
});

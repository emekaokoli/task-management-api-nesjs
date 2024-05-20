import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { tasks } from 'src/db/queries';
import { Task } from '../types';
import { TaskGateway } from './tasks.gateway';

@Injectable()
export class TaskService {
  constructor(
    @Inject('DATABASE_POOL') private pool: Pool,
    private readonly taskGateway: TaskGateway,
  ) {}

  async createTask(
    title: string,
    description: string,
    userId: number,
  ): Promise<Task> {
    const result = await this.pool.query(tasks.insert, [
      title,
      description,
      false,
      userId,
    ]);
    const task = result.rows[0];
    this.taskGateway.emitTaskCreated(task);
    return task;
  }

  async getTasks(userId: number): Promise<Task[]> {
    const result = await this.pool.query(tasks.selectById, [userId]);
    return result.rows;
  }

  async updateTask(
    id: number,
    title: string,
    description: string,
    completed: boolean,
  ): Promise<Task> {
    const result = await this.pool.query(tasks.update, [
      title,
      description,
      completed,
      id,
    ]);
    const task = result.rows[0];
    this.taskGateway.emitTaskUpdated(task);
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    await this.pool.query(tasks.delete, [id]);
    this.taskGateway.emitTaskDeleted(id);
  }
}

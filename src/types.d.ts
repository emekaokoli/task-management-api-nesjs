export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user_id: number;
}

export interface User {
  id: number;
  username: string;
  password: string;
}

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    username: string;
  };
}

export interface TaskGatewayInterface {
  emitTaskCreated(task: Task): void;
  emitTaskUpdated(task: Task): void;
  emitTaskDeleted(taskId: number): void;
}
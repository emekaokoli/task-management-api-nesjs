import { Task } from '../types';
import { TaskGateway } from './tasks.gateway';

export class TaskGatewayMock extends TaskGateway {
  emitTaskCreated(task: Task): void {
    // Mock implementation to emit task created event
    console.log(`Task created: ${JSON.stringify(task)}`);
  }

  emitTaskUpdated(task: Task): void {
    // Mock implementation to emit task updated event
    console.log(`Task updated: ${JSON.stringify(task)}`);
  }

  emitTaskDeleted(taskId: number): void {
    // Mock implementation to emit task deleted event
    console.log(`Task deleted with ID: ${taskId}`);
  }
}

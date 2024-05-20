import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Task } from '../types';

@WebSocketGateway()
export class TaskGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  // constructor(private readonly taskService: TaskService) {}

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  emitTaskCreated(task: Task) {
    this.server.emit('taskCreated', task);
  }

  emitTaskUpdated(task: Task) {
    this.server.emit('taskUpdated', task);
  }

  emitTaskDeleted(taskId: number) {
    this.server.emit('taskDeleted', taskId);
  }
}

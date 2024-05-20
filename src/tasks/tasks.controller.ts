import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AuthenticatedRequest } from '../types';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { CreateTaskDto, CreateTaskDtoType } from './dto/create-task.dto';
import { UpdateTaskDto, UpdateTaskDtoType } from './dto/update-task.dto';
import { TaskService } from './tasks.service';

@Controller('api/tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created.',
  })
  @UsePipes(new ZodValidationPipe(CreateTaskDto))
  createTask(
    @Body() createTaskDto: CreateTaskDtoType,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.sub;
    return this.taskService.createTask(
      createTaskDto.title,
      createTaskDto.description,
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  getTasks(@Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;
    return this.taskService.getTasks(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated.',
  })
  @UsePipes(new ZodValidationPipe(UpdateTaskDto))
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDtoType,
  ) {
    return this.taskService.updateTask(
      parseInt(id, 10),
      updateTaskDto.title,
      updateTaskDto.description,
      updateTaskDto.completed,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete an existing task' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted.',
  })
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(parseInt(id, 10));
  }
}

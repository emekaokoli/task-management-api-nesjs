import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDTo {
  @ApiProperty({
    example: 'Learn NestJS',
    description: 'The title of the task',
  })
  title: string;

  @ApiProperty({
    example: 'This is a task description',
    description: 'The description of the task',
  })
  description: string;
}

export class UpdateTaskDTo {
  @ApiProperty({
    example: 'Learn NestJS',
    description: 'The title of the task',
  })
  title: string;

  @ApiProperty({
    example: 'This is a task description',
    description: 'The description of the task',
  })
  description: string;

  @ApiProperty({
    example: false,
    description: 'The completion status of the task',
  })
  completed: boolean;
}

import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user123', description: 'The username of the user' })
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'user123', description: 'The username of the user' })
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;
}

export class TaskDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the task' })
  id: number;

  @ApiProperty({
    example: 'Learn Python',
    description: 'The title of the task',
  })
  title: string;

  @ApiProperty({
    example: 'This is the best course ever.',
    description: 'The description of the task',
  })
  description: string;

  @ApiProperty({
    example: true,
    description: 'The completion status of the task',
  })
  completed: boolean;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the task',
  })
  user_id: number;
}

export class UserDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: number;

  @ApiProperty({ example: 'user123', description: 'The username of the user' })
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImphbmUiLCJzdWIiOjQsImlhdCI6MTcxNjIwMTAyMCwiZXhwIjoxNzE2MjA0NjIwfQ.OY5g4lvPiNjaCncfYnxlybrH1cZRs2gNnguC7pekCSc',
    description: 'JWT token',
  })
  token: string;
}

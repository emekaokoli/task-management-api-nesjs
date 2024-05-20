import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { RegisterDto, RegisterDtoType } from '../auth/dto/register.dto';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { UserService } from './users.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterDto))
  async register(@Body() registerDto: RegisterDtoType) {
    return this.userService.createUser(
      registerDto.username,
      registerDto.password,
    );
  }
}

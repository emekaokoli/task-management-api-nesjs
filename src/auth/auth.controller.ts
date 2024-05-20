import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto, LoginDtoType } from './dto/login.dto';
import { RegisterDto, RegisterDtoType } from './dto/register.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  async login(@Body() body: LoginDtoType) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterDto))
  async register(@Body() body: RegisterDtoType) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }
}

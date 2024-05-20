import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../zod-validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto, LoginDtoType } from './dto/login.dto';
import { RegisterDto, RegisterDtoType } from './dto/register.dto';
import {
  LoginDto as LoginDTo,
  LoginResponseDto,
  RegisterDto as RegisterDTo,
  UserDto,
} from './dto/swaggerDto';

@ApiTags('auth')
@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDTo })
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
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserDto,
  }) // Define response type
  @ApiBody({ type: RegisterDTo })
  @UsePipes(new ZodValidationPipe(RegisterDto))
  async register(@Body() body: RegisterDtoType) {
    const { username, password } = body;
    return this.authService.register(username, password);
  }
}

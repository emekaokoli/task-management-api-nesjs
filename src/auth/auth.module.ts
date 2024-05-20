import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../db/database.module';
import { TaskController } from '../tasks/tasks.controller';
import { TaskModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'topSecret51',
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    TaskModule,
  ],
  providers: [AuthService, UserService, JwtAuthGuard],
  controllers: [AuthController, TaskController],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../db/database.module';
import { TaskController } from './tasks.controller';
import { TaskGateway } from './tasks.gateway';
import { TaskService } from './tasks.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'topSecret51',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskGateway],
  exports: [TaskService],
})
export class TaskModule {}

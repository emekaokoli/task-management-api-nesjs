import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { tasks } from '../db/queries';
import { User } from '../types';

@Injectable()
export class UserService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async findUserByUsername(username: string): Promise<User | null> {
    const result = await this.pool.query(tasks.findByUserName, [username]);
    return result.rows[0];
  }

  async createUser(username: string, password: string): Promise<User> {
    const result = await this.pool.query(tasks.createNewUser, [
      username,
      password,
    ]);
    return result.rows[0] as User;
  }
}

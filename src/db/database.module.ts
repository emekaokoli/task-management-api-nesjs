import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: (configService: ConfigService) => {
        return new Pool({
          // host: configService.get('PG_HOST'),
          // port: configService.get('PG_PORT'),
          // user: configService.get('PG_USER'),
          // password: configService.get('PG_PASSWORD'),
          // database: configService.get('PG_DATABASE'),
          connectionString: configService.get('DATABASE_URL'),
          ssl: false,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore as any,
      socket: {
        host: process.env.REDIS_HOST || 'familykart-redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}

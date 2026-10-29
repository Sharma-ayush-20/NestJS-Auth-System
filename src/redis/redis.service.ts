import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  //connect with local Docker Redis
  private redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  });

  //Read from Cache
  async get(key: string) {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  //save to cache (write operation -> expires after 60 seconds by default)
  async set(key: string, value: any, ttlSeconds: number = 60) {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  //The "Stale Data" Problem (Cache Invalidation)
  // The Solution: Cache Busting / Invalidation 
  // Whenever data is mutated (Created, Updated, or Deleted): We immediately tell Redis: "Wipe out all old courses:* cache keys right now!"
  async clear(pattern: string = 'courses:*'){
    const keys = await this.redisClient.keys(pattern)
    if(keys.length > 0){
       await this.redisClient.del(...keys);
       console.log(`🧹 Cache cleared for ${pattern} (${keys.length} keys removed)`);
    }
  }

}

import Redis from 'ioredis';

const getRedisUrl = () => {
  const url = process.env.REDIS_URL;
  if (!url) throw new Error('REDIS_URL is not set');
  return url;
};

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) redis = new Redis(getRedisUrl(), { maxRetriesPerRequest: null });
  return redis;
}

export function createRedisConnection(): Redis {
  return new Redis(getRedisUrl(), { maxRetriesPerRequest: null });
}

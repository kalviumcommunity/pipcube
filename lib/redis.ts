
import Redis from 'ioredis';
import { logger } from './logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL);

redis.on('connect', () => {
    logger.info('Redis connected', { url: REDIS_URL });
});

redis.on('error', (err) => {
    logger.error('Redis connection error', { error: err.message });
});

export default redis;

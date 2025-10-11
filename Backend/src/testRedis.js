// testRedis.js
import client from './config/redis.js';

const test = async () => {
  await client.set('foo', 'bar');
  const value = await client.get('foo');
  console.log('Value from Redis:', value);
  process.exit(0);
};

test();

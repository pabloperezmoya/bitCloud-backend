import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  mongo: {
    dbName: process.env.MONGO_DB,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    port: process.env.MONGO_PORT,
    host: process.env.MONGO_HOST,
    connection: process.env.MONGO_CONNECTION,
  },
}));

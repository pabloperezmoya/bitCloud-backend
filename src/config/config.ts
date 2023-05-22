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
  storage: {
    bucketName: process.env.BUCKET_NAME,
    endpointProvider: process.env.ENDPOINT_PROVIDER,
    accountId: process.env.ACCOUNT_ID,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    bucketRegion: process.env.REGION,
  },
  clerk: {
    clerkWebhookSignInSecret: process.env.CLERK_WEBHOOK_SIGN_IN_SECRET,
  },
}));

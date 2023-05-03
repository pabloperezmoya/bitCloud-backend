import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StorageModule } from './storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
      // validationSchema: Joi.object({
      //   API_KEY: Joi.number().required(),
      //   DATABASE_NAME: Joi.string().required(),
      //   DATABASE_PORT: Joi.number().required(),
      // }),
    }),
    UsersModule,
    StorageModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

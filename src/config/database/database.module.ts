import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from '../config';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        const { connection, user, password, host, port, dbName } =
          configService.mongo;
        console.log(
          `${connection}://${user}:${password}@${host}:${port}/${dbName}?retryWrites=true&w=majority`,
        );
        if (connection === 'mongodb+srv') {
          // Dont include port if using mongodb+srv
          return {
            uri: `${connection}://${user}:${password}@${host}/${dbName}?retryWrites=true&w=majority`,
          };
        }

        return {
          uri: `${connection}://${user}:${password}@${host}:${port}/${dbName}?retryWrites=true&w=majority`,
        };
      },
      inject: [config.KEY],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

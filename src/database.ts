import { Connection, createConnection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Use useFactory, useClass, or useExisting
      // to configure the ConnectionOptions.
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['dist/**/entities/*.entity{.ts,.js}'],
        migrations: ['dist/**/migrations/*{.ts,.js}'],
        synchronize: configService.get('SYNCHRONIZE') == 'true' ? true : false,
        logging: false,
        cli: {
          migrationsDir: 'src/migrations',
        },
      }),

      // connectionFactory receives the configured ConnectionOptions
      // and returns a Promise<Connection>.
      connectionFactory: async (options) => {
        const connection = await createConnection(options);
        return connection;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  constructor(connection: Connection) {
    if (connection.isConnected) console.log('DB Connecting Successfuly!');
  }
}

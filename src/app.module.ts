import * as Joi from '@hapi/joi';
import { forwardRef, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { RolesModule } from './roles/roles.module';
import { DatabaseModule } from './database';

@Module({
  imports: [
    forwardRef(() => DatabaseModule),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.required(),
        DB_PORT: Joi.number().default(3306),
        DB_NAME: Joi.required(),
        DB_USER: Joi.required(),
        DB_PASSWORD: Joi.required(),
        APP_PORT: Joi.required(),
        JWT_EXPIRATION_TIME: Joi.string(),
        PASSWORD_CRYPT_LENGTH: Joi.number(),
      }),
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        playground:
          configService.get('NODE_ENV') === 'production' ? false : true,
        debug: configService.get('NODE_ENV') === 'production' ? false : true,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: (connectionParams: any) => {
              return {
                req: {
                  headers: connectionParams,
                },
              };
            },
          },
        },
        sortSchema: true,
        // path: 'api/v1/graphql',
        cors: {
          credentials: true,
          origin: true,
        },
      }),
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

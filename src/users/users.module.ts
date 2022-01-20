import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [forwardRef(() => RolesModule), TypeOrmModule.forFeature([User])],
  providers: [
    UsersResolver,
    UsersService,
    { provide: 'PUB_SUB', useValue: new PubSub() },
  ],
  exports: [UsersService],
})
export class UsersModule {}

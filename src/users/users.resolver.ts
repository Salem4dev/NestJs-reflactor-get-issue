import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { CheckPermissions } from 'src/roles/decorators/roles.decorator';
import { PubSub } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly usersService: UsersService,
  ) {}

  @CheckPermissions(['create', User.name])
  // @CheckPermissions([PermissionAction.CREATE, User.name])
  @Query(() => [User])
  async allUsers(): Promise<User[]> {
    return await this.usersService.findAll().catch((err) => {
      throw err;
    });
  }
  // @CheckPermissions("super_admin")
  @Query(() => User)
  async getUser(@Args('id') id: string): Promise<User> {
    return await this.usersService.findOne(id).catch((err) => {
      throw err;
    });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('UpdateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.usersService
      .update(updateUserInput.id, updateUserInput)
      .catch((err) => {
        throw err;
      });
    return user;
  }

  @Mutation(() => User)
  async removeUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<User> {
    const user = await this.usersService.remove(id).catch((err) => {
      throw err;
    });
    return user;
  }

  @Subscription(() => User)
  async userAdded() {
    return this.pubSub.asyncIterator('userAdded');
  }
  @Subscription(() => User)
  async userUpdated() {
    return this.pubSub.asyncIterator('userUpdated');
  }
  @Subscription(() => User)
  async userDeleted() {
    return this.pubSub.asyncIterator('userDeleted');
  }
}

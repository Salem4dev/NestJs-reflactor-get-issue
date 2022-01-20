import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { RolesService } from '../services/role.service';
import { Role } from '../entities/role.entity';
import { CreateRoleInput, UpdateRoleInput } from '../dto/role.input';

@Resolver('RoleRes')
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => Role)
  public async createRole(
    @Args('CreateRoleInput') createRoleInput: CreateRoleInput,
  ): Promise<Role> {
    // console.log("context", context);
    return await this.rolesService.create(createRoleInput).catch((err) => {
      throw err;
    });
  }

  @Query(() => [Role])
  public async allRoles(): Promise<Role[]> {
    // console.log("context", req);
    return await this.rolesService.findAll().catch((err) => {
      throw err;
    });
  }

  @Query(() => Role)
  public async getRole(@Args('id') id: string): Promise<Role> {
    return await this.rolesService.findById(id).catch((err) => {
      throw err;
    });
  }

  @Mutation(() => Role)
  public async updateRole(
    @Args('UpdateRoleInput') updateRoleInput: UpdateRoleInput,
  ): Promise<Role> {
    return await this.rolesService
      .update(updateRoleInput.id, updateRoleInput)
      .catch((err) => {
        throw err;
      });
  }

  @Mutation(() => Role)
  public async removeRole(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Role> {
    return await this.rolesService.remove(id).catch((err) => {
      throw err;
    });
  }
}

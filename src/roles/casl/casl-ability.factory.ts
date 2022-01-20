import { Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

export type PermissionObjectType = any;
export type AppAbility = Ability<[string, string]>;
interface CaslPermission {
  action: string;
  // In our database, Invoice, Project... are called "object"
  // but in CASL they are called "subject"
  subject: string;
}
@Injectable()
export class CaslAbilityFactory {
  constructor(private userService: UsersService) {}
  async createForUser(user: User): Promise<AppAbility> {
    const dbPermissions: string[] =
      await this.userService.findAllPermissionsOfUser(user);
    const caslPermissions: CaslPermission[] = dbPermissions.map((p) => ({
      action: p,
      subject: p,
    }));
    return new Ability<[string, string]>(caslPermissions);
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Type,
  Scope,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AppAbility, CaslAbilityFactory } from '../casl/casl-ability.factory';
import {
  PERMISSION_CHECKER_KEY,
  RequiredPermission,
} from '../decorators/roles.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('requiredPermissionsq', context);
    const requiredPermissions =
      this.reflector.get<RequiredPermission[]>(
        PERMISSION_CHECKER_KEY,
        context.getHandler(),
      ) || [];
    console.log('requiredPermissions', requiredPermissions);
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    const ability = await this.abilityFactory.createForUser(user);
    return requiredPermissions.every((permission) =>
      this.isAllowed(ability, permission),
    );
  }
  private isAllowed(
    ability: AppAbility,
    permission: RequiredPermission,
  ): boolean {
    return ability.can(...permission);
  }
}
// @Injectable()
// export class PermissionsGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private caslAbilityFactory: CaslAbilityFactory,
//     private readonly moduleRef: ModuleRef,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const policiesHandlersRef =
//       this.reflector.get<Type<RequiredPermission[]>>(
//         PERMISSION_CHECKER_KEY,
//         context.getHandler(),
//       ) || [];
//     const ctx = GqlExecutionContext.create(context);
//     const user = ctx.getContext().req.user;
//     const contextId = ContextIdFactory.create();
//     this.moduleRef.registerRequestByContextId(ctx.getContext().req, contextId);
//     const policyHandlers = [];
//     for (let i = 0; i < policiesHandlersRef.length; i++) {
//       const policyHandlerRef = policiesHandlersRef[i];
//       const policyScope = this.moduleRef.introspect(policyHandlerRef).scope;
//       let policyHandler: RequiredPermission;
//       if (policyScope === Scope.DEFAULT) {
//         policyHandler = this.moduleRef.get(policyHandlerRef, { strict: false });
//       } else {
//         policyHandler = await this.moduleRef.resolve(
//           policyHandlerRef,
//           contextId,
//           { strict: false },
//         );
//       }
//       policyHandlers.push(policyHandler);
//     }
//     const ability = this.caslAbilityFactory.createForUser(user);
//     return policyHandlers.every(async (permission) =>
//       this.isAllowed(await ability, permission),
//     );
//   }

//   private isAllowed(
//     ability: AppAbility,
//     permission: RequiredPermission,
//   ): boolean {
//     return ability.can(...permission);
//   }
// }

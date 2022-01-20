import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './guards/roles.guard';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './services/role.service';
import { RolesResolver } from './resolvers/roles.resolver';
import { CaslAbilityFactory } from './casl/casl-ability.factory';

@Module({
  imports: [forwardRef(() => UsersModule), TypeOrmModule.forFeature([Role])],
  controllers: [],
  providers: [
    CaslAbilityFactory,
    RolesResolver,
    RolesService,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [CaslAbilityFactory, RolesService, RolesResolver],
})
export class RolesModule {}

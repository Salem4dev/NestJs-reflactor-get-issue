import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleInput, UpdateRoleInput } from '../dto/role.input';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private RoleRepository: Repository<Role>,
  ) {}

  public async create(createRoleInput: CreateRoleInput): Promise<Role> {
    const newRole = this.RoleRepository.create({ ...createRoleInput });
    await this.RoleRepository.save(newRole).catch((err) => {
      console.log('err=======>', err);
      new InternalServerErrorException();
    });
    return newRole;
  }

  public async update(
    id: string,
    updateRoleInput: UpdateRoleInput,
  ): Promise<Role> {
    const role = await this.RoleRepository.preload({
      id: id,
      ...updateRoleInput,
    });
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    return this.RoleRepository.save(role);
    ``;
  }
  public async findAll(): Promise<Role[]> {
    return await this.RoleRepository.find({
      relations: ['users'],
    }).catch((err) => {
      throw new InternalServerErrorException(err);
    });
  }
  public async findById(id: string): Promise<Role> {
    const role = await this.RoleRepository.findOne(id, {
      relations: ['users'],
    });
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`);
    }
    return role;
  }
  public async findByUserId(userId: string): Promise<Role> {
    const role = await this.RoleRepository.findOne({
      where: { users: userId },
      relations: ['users'],
    });
    if (!role) {
      throw new NotFoundException(`Role #${userId} not found`);
    }
    return role;
  }
  async findByName(name: string): Promise<Role> {
    const role = await this.RoleRepository.findOne(
      { name: name },
      { relations: ['users'] },
    );
    if (!role) {
      return undefined;
    }
    return role;
  }

  public async remove(id: string): Promise<Role> {
    const role = await this.findById(id);
    await this.RoleRepository.softRemove(role);
    return role;
  }
}

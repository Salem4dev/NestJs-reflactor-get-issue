import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { RolesService } from 'src/roles/services/role.service';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
    private readonly roleService: RolesService,
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
  ) {}

  public async update(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const role = await this.roleService.findById(updateUserInput.roleId);
    // eslint-disable-next-line prefer-const
    let data = { id: id, ...updateUserInput };
    if (role) {
      data['role'] = role;
    }
    const user = await this.UserRepository.preload(data);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    this.pubSub.publish('userUpdated', {
      userUpdated: user,
    });
    return this.UserRepository.save(user);
  }

  public async save(dto: User): Promise<User> {
    const user = await this.UserRepository.preload(dto);
    return await this.UserRepository.save(user);
  }
  public async findAll(): Promise<User[]> {
    return await this.UserRepository.find({ relations: ['role'] }).catch(
      (err) => {
        throw new InternalServerErrorException();
      },
    );
  }
  public async findOne(id: string): Promise<User> {
    const user = await this.UserRepository.findOne(id, { relations: ['role'] });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByEmailAndType(email: string, type: string): Promise<User> {
    const user = await this.UserRepository.findOne({
      email: email,
      type: type,
    });
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    return user;
  }
  async findById(id: string): Promise<User> {
    console.log('user_id', id);

    const user = await this.UserRepository.findOne(
      { id: id },
      { relations: ['role'] },
    );
    if (user) {
      return user;
    }
    throw new NotFoundException('User with this id does not exist');
  }

  public async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.UserRepository.softRemove(user);
    this.pubSub.publish('userDeleted', {
      userDeleted: user,
    });
    return user;
  }
  async findAllPermissionsOfUser(user: any): Promise<any> {
    return [user];
  }
}

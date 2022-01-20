import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
@Unique(['code'])
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field({ nullable: true })
  name: string;

  @Column()
  @Field()
  code: string;

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.role, {
    cascade: ['insert', 'update', 'soft-remove'],
  })
  users: User[];

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt!: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt!: Date;

  @DeleteDateColumn()
  @Field({ nullable: true })
  deletedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  nameToLowerCase() {
    this.code = this.name.toLowerCase().split(' ').join('_');
  }
  constructor(data?: Partial<Role>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

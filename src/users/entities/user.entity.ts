import { Field, ID, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { Role } from 'src/roles/entities/role.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  username: string;

  @Column()
  @IsEmail()
  @Field()
  email: string;

  @Column({ nullable: true })
  @IsString()
  @Field({ nullable: true })
  recoveryKey: string;

  @Column()
  @Field()
  type: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastName: string;

  @Column({ nullable: true, default: false })
  @Field({ nullable: true })
  isActive: boolean;

  @Column()
  @Field()
  password: string;

  @Field(() => Role, { nullable: true })
  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'SET NULL',
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  role: Role;

  @Field({ nullable: true })
  @Column({ nullable: true })
  roleId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  @Field({ nullable: true })
  createdAt!: Date;

  @UpdateDateColumn()
  @Field({ nullable: true })
  updatedAt!: Date;

  @DeleteDateColumn()
  @Field({ nullable: true })
  deletedAt!: Date;
  created_at: any;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

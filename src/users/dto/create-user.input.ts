import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import {
  Max,
  Min,
  MaxLength,
  Length,
  IsAlpha,
  isEnum,
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsEmail,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @IsString()
  @Field()
  email: string;

  @IsString()
  @Field()
  password: string;

  @IsString()
  @Field()
  type: string;

  @IsString()
  @Field({ nullable: true })
  firstName: string;

  @IsString()
  @Field({ nullable: true })
  lastName: string;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  isActive: boolean;

  @IsString()
  @Field({ nullable: true })
  username: string;

  @IsString()
  @Field({ nullable: true })
  roleId: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  refreshToken: string;
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @IsString()
  @Field()
  id: string;
}

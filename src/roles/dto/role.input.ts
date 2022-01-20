import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateRoleInputTranslation {
  @IsString()
  @Field({ nullable: true })
  modelId: string;

  @IsString()
  @Field()
  localeId: string;

  @IsString()
  @Field()
  name: string;
}

@InputType()
export class CreateRoleInput {
  @IsString()
  @Field()
  name: string;

  @Field(() => [CreateRoleInputTranslation])
  translation: CreateRoleInputTranslation[];
}

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @IsString()
  @Field()
  id: string;
}

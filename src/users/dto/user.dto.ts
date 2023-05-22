import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AuthMethods } from '../entities/user.entity';

export class UserDTO {
  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'jhon@doe.com' })
  readonly email: string;
}

export class CreateUserDTO {
  @IsString()
  @ApiProperty({ example: 'user_34325hjsdkhfjksaf' })
  userId: string;

  @IsString()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ example: 'jhon@doe.com' })
  readonly email: string;

  @IsString()
  @Length(6)
  @ApiProperty({ example: '123456' })
  password: string;

  @IsString()
  authMethod: AuthMethods;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1684595061206 })
  createdAt?: number;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
